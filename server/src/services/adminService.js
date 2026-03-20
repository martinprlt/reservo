import prisma from '../config/prisma.js';
import { listar as listarClientes, obtenerPorId } from './clientesService.js';
import { listar as listarServicios } from './serviciosService.js';

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

export async function obtenerTurno(tenantId, turnoId) {
  const turno = await prisma.turno.findUnique({
    where: { id: turnoId },
    include: { servicio: true, cliente: true, pagos: true },
  });

  if (!turno || turno.tenantId !== tenantId) {
    throw new Error('RECURSO_NO_ENCONTRADO');
  }

  return turno;
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

export async function eliminarTurno(tenantId, turnoId) {
  const turno = await prisma.turno.findUnique({ where: { id: turnoId } });

  if (!turno || turno.tenantId !== tenantId) {
    throw new Error('RECURSO_NO_ENCONTRADO');
  }

  return prisma.turno.update({
    where: { id: turnoId },
    data: { estado: 'CANCELADO' },
  });
}

export async function eliminarTurnosMasivo(tenantId, ids) {
  await prisma.turno.updateMany({
    where: { id: { in: ids }, tenantId },
    data: { estado: 'CANCELADO' },
  });
}

export async function eliminarTurnosCliente(tenantId, clienteId) {
  const result = await prisma.turno.updateMany({
    where: { clienteId, tenantId, estado: { not: 'CANCELADO' } },
    data: { estado: 'CANCELADO' },
  });
  return result.count;
}

export async function listarClientesService(tenantId, params) {
  return listarClientes(tenantId, params);
}

export async function obtenerCliente(tenantId, clienteId) {
  return obtenerPorId(tenantId, clienteId);
}

export async function listarServiciosAdmin(tenantId) {
  return listarServicios(tenantId);
}

export async function crearServicio(tenantId, data) {
  const { crear } = await import('./serviciosService.js');
  return crear(tenantId, data);
}

export async function actualizarServicio(tenantId, servicioId, data) {
  const { actualizar } = await import('./serviciosService.js');
  return actualizar(tenantId, servicioId, data);
}

export async function eliminarServicio(tenantId, servicioId) {
  const { eliminar } = await import('./serviciosService.js');
  return eliminar(tenantId, servicioId);
}

export async function obtenerConfig(tenantId) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { config: true },
  });

  return tenant?.config || {};
}

export async function actualizarConfig(tenantId, config) {
  const current = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { config: true },
  });

  const merged = { ...current.config, ...config };

  return prisma.tenant.update({
    where: { id: tenantId },
    data: { config: merged },
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
