import prisma from '../config/prisma.js';
import { calcularSlotsLibres } from './disponibilidadService.js';
import { procesarPagoAprobado } from './pagosService.js';

export async function crear(tenantId, { servicioId, varianteId, fechaHora, nombre, apellido, telefono, notas }) {
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

  const slotLibre = slots.find(s => s.inicio.getTime() === fecha.getTime());
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
    },
  });

  let initPoint = null;

  if (process.env.MP_ACCESS_TOKEN) {
    const { MercadoPagoConfig, Preference } = await import('mercadopago');
    const mpClient = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
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
          success: `${process.env.MP_BACK_URL}?turnoId=${turno.id}&status=success`,
          failure: `${process.env.MP_BACK_URL}?turnoId=${turno.id}&status=failure`,
          pending: `${process.env.MP_BACK_URL}?turnoId=${turno.id}&status=pending`,
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

  return { turnoId: turno.id, initPoint };
}

export async function obtenerEstado(turnoId) {
  const turno = await prisma.turno.findUnique({
    where: { id: turnoId },
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
