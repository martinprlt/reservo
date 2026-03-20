import prisma from '../config/prisma.js';
import clientesService from './clientesService.js';
import serviciosService from './serviciosService.js';

export async function listarTurnos(tenantId, { fecha, estado }) {
  const where = { tenantId };

  if (fecha) {
    const fechaDate = new Date(fecha);
    const inicioDia = new Date(fechaDate);
    inicioDia.setHours(0, 0, 0, 0);
    const finDia = new Date(fechaDate);
    finDia.setHours(23, 59, 59, 999);
    where.fechaHora = { gte: inicioDia, lte: finDia };
  }

  if (estado) {
    where.estado = estado;
  }

  return prisma.turno.findMany({
    where,
    include: { servicio: true, cliente: true },
    orderBy: { fechaHora: 'asc' },
  });
}

export async function actualizarTurno(tenantId, turnoId, { estado, notas }) {
  const turno = await prisma.turno.findUnique({ where: { id: turnoId } });

  if (!turno || turno.tenantId !== tenantId) {
    throw new Error('RECURSO_NO_ENCONTRADO');
  }

  return prisma.turno.update({
    where: { id: turnoId },
    data: { estado, notas },
    include: { servicio: true, cliente: true },
  });
}

export async function listarClientes(tenantId, params) {
  return clientesService.listar(tenantId, params);
}

export async function obtenerCliente(tenantId, clienteId) {
  return clientesService.obtenerPorId(tenantId, clienteId);
}

export async function listarServicios(tenantId) {
  return serviciosService.listar(tenantId);
}

export async function crearServicio(tenantId, data) {
  return serviciosService.crear(tenantId, data);
}

export async function actualizarServicio(tenantId, servicioId, data) {
  return serviciosService.actualizar(tenantId, servicioId, data);
}

export async function eliminarServicio(tenantId, servicioId) {
  return serviciosService.eliminar(tenantId, servicioId);
}

export async function obtenerConfig(tenantId) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { config: true },
  });

  return tenant?.config || {};
}

export async function actualizarConfig(tenantId, config) {
  return prisma.tenant.update({
    where: { id: tenantId },
    data: { config },
    select: { config: true },
  });
}

export async function obtenerAgenda(tenantId, { desde, hasta }) {
  const inicio = desde ? new Date(desde) : new Date();
  inicio.setHours(0, 0, 0, 0);

  const fin = hasta ? new Date(hasta) : new Date(inicio);
  fin.setDate(fin.getDate() + 7);
  fin.setHours(23, 59, 59, 999);

  const turnos = await prisma.turno.findMany({
    where: {
      tenantId,
      fechaHora: { gte: inicio, lte: fin },
      estado: { not: 'CANCELADO' },
    },
    include: { servicio: true, cliente: true },
    orderBy: { fechaHora: 'asc' },
  });

  return turnos;
}
