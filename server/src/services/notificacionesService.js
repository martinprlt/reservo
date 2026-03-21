import prisma from '../config/prisma.js';

export async function crear(tenantId, { tipo, titulo, mensaje, link }) {
  return prisma.notificacion.create({
    data: { tenantId, tipo, titulo, mensaje, link },
  });
}

export async function listar(tenantId, { soloNoLeidas = false, limit = 20 }) {
  const where = { tenantId };
  if (soloNoLeidas) where.leida = false;

  return prisma.notificacion.findMany({
    where,
    orderBy: { creadoEn: 'desc' },
    take: limit,
  });
}

export async function contarNoLeidas(tenantId) {
  return prisma.notificacion.count({
    where: { tenantId, leida: false },
  });
}

export async function marcarLeida(tenantId, notificacionId) {
  const notif = await prisma.notificacion.findUnique({
    where: { id: notificacionId },
  });

  if (!notif || notif.tenantId !== tenantId) {
    throw new Error('RECURSO_NO_ENCONTRADO');
  }

  return prisma.notificacion.update({
    where: { id: notificacionId },
    data: { leida: true },
  });
}

export async function marcarTodasLeidas(tenantId) {
  return prisma.notificacion.updateMany({
    where: { tenantId, leida: false },
    data: { leida: true },
  });
}

// Helper to create notifications from turnos events
export async function notificarNuevoTurno(tenantId, turno) {
  await crear(tenantId, {
    tipo: 'NUEVO_TURNO',
    titulo: 'Nuevo turno reservado',
    mensaje: `${turno.cliente.nombre} ${turno.cliente.apellido} reservó ${turno.servicio.nombre}`,
    link: null,
  });
}

export async function notificarPagoRecibido(tenantId, turno) {
  await crear(tenantId, {
    tipo: 'PAGO_RECIBIDO',
    titulo: 'Seña recibida',
    mensaje: `${turno.cliente.nombre} pagó $${turno.montoSenia?.toLocaleString('es-AR')} por ${turno.servicio.nombre}`,
    link: null,
  });
}

export async function notificarTurnoManana(tenantId, turno) {
  await crear(tenantId, {
    tipo: 'TURNO_MANANA',
    titulo: 'Turno mañana',
    mensaje: `${turno.cliente.nombre} tiene turno mañana a las ${new Date(turno.fechaHora).getHours()}:00`,
    link: null,
  });
}
