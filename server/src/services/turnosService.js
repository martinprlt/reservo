import prisma from '../config/prisma.js';
import { calcularSlotsLibres } from './disponibilidadService.js';
import { procesarPagoAprobado } from './pagosService.js';
import { notificarNuevoTurno } from './notificacionesService.js';
import { enviarNuevoTurnoAdmin } from './whatsappService.js';
import { enviarPushAdmin } from './pushService.js';
import { getPlanLimits } from '../config/plans.js';

export async function crear(tenantId, { servicioId, varianteId, fechaHora, nombre, apellido, telefono, notas, fotoUrl, fotoPublicId, aceptaNotificaciones }) {
  // Check plan limit for turns per month
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId }, select: { plan: true, config: true, slug: true } });
  const limits = getPlanLimits(tenant?.plan);

  if (limits.maxTurnosMes !== Infinity) {
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);
    const turnosMes = await prisma.turno.count({
      where: { tenantId, creadoEn: { gte: inicioMes }, estado: { not: 'CANCELADO' } },
    });
    if (turnosMes >= limits.maxTurnosMes) {
      throw new Error('LIMITE_TURNOS_MES_ALCANZADO');
    }
  }

  const servicio = await prisma.servicio.findFirst({
    where: { id: servicioId, tenantId, activo: true },
  });

  if (!servicio) throw new Error('RECURSO_NO_ENCONTRADO');

  const variantes = servicio.variantes || [];
  const variante = varianteId ? variantes.find(v => v.id === varianteId) : null;
  const duracionExtra = variante?.duracionExtra || 0;
  const precioExtra = variante?.precioExtra || 0;
  const montoSenia = servicio.montoSenia + precioExtra;

  const fecha = new Date(fechaHora);
  const slots = await calcularSlotsLibres(tenantId, servicioId, fecha);

  const slotLibre = slots.find(s => new Date(s.inicio).getTime() === fecha.getTime());
  if (!slotLibre) throw new Error('SLOT_NO_DISPONIBLE');

  const cliente = await prisma.cliente.upsert({
    where: { tenantId_telefono: { tenantId, telefono } },
    create: { tenantId, nombre, apellido, telefono },
    update: {},
  });

  const duracionTotal = servicio.duracionMinutos + duracionExtra;

  const turno = await prisma.turno.create({
    data: {
      tenantId,
      servicioId,
      clienteId: cliente.id,
      fechaHora: fecha,
      duracion: duracionTotal,
      estado: 'RESERVADO',
      precioTotal: servicio.precio + precioExtra,
      montoSenia,
      expiraEn: new Date(Date.now() + 15 * 60 * 1000),
      notas: notas || null,
      fotoUrl: fotoUrl || null,
      fotoPublicId: fotoPublicId || null,
      aceptaNotificaciones: aceptaNotificaciones || false,
    },
  });

  let initPoint = null;

  const mpAccessToken = tenant?.config?.mpAccessToken || process.env.MP_ACCESS_TOKEN;

  if (mpAccessToken) {
    const { MercadoPagoConfig, Preference } = await import('mercadopago');
    const mpClient = new MercadoPagoConfig({ accessToken: mpAccessToken });
    const pref = await new Preference(mpClient).create({
      body: {
        items: [{
          title: servicio.nombre + (variante ? ` - ${variante.nombre}` : ''),
          unit_price: montoSenia,
          quantity: 1,
          currency_id: 'ARS',
        }],
        payer: { name: nombre, surname: apellido },
        back_urls: {
          success: `${process.env.MP_BACK_URL}/booking/confirmacion?turnoId=${turno.id}&status=success&tenant=${tenant.slug}`,
          failure: `${process.env.MP_BACK_URL}/booking/confirmacion?turnoId=${turno.id}&status=failure&tenant=${tenant.slug}`,
          pending: `${process.env.MP_BACK_URL}/booking/confirmacion?turnoId=${turno.id}&status=pending&tenant=${tenant.slug}`,
        },
        auto_return: 'approved',
        external_reference: turno.id,
      },
    });

    await prisma.turno.update({
      where: { id: turno.id },
      data: { mpPrefId: pref.id },
    });

    initPoint = pref.init_point;
  }

  // Create notification for admin + WhatsApp + Push
  try {
    await notificarNuevoTurno(tenantId, { cliente, servicio });
  } catch {}
  try {
    await enviarNuevoTurnoAdmin(tenant, { cliente, servicio, fechaHora });
  } catch {}
  try {
    const fechaFormateada = new Date(fechaHora).toLocaleDateString('es-AR', {
      weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
    });
    await enviarPushAdmin(tenantId, {
      title: '📅 Nuevo turno reservado',
      body: `${cliente.nombre} ${cliente.apellido} — ${servicio.nombre}\n${fechaFormateada}`,
      tag: 'nuevo-turno',
    });
  } catch {}

  return { turnoId: turno.id, initPoint };
}

export async function obtenerEstado(turnoId, tenantId) {
  const turno = await prisma.turno.findFirst({
    where: { id: turnoId, tenantId },
    include: { servicio: true, cliente: true },
  });

  if (!turno) throw new Error('RECURSO_NO_ENCONTRADO');

  return {
    id: turno.id,
    estado: turno.estado,
    fechaHora: turno.fechaHora,
    servicio: turno.servicio.nombre,
    cliente: `${turno.cliente.nombre} ${turno.cliente.apellido}`,
  };
}

export async function confirmarPago(turnoId, mpPaymentId) {
  return procesarPagoAprobado(turnoId, mpPaymentId);
}
