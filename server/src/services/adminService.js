import prisma from '../config/prisma.js';
import { listar as listarClientes, obtenerPorId } from './clientesService.js';
import { listar as listarServicios } from './serviciosService.js';
import { calcularSlotsLibres } from './disponibilidadService.js';

export async function obtenerStats(tenantId) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const finHoy = new Date(hoy);
  finHoy.setHours(23, 59, 59, 999);

  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0, 23, 59, 59, 999);

  const hace7dias = new Date(hoy);
  hace7dias.setDate(hace7dias.getDate() - 7);

  const [turnosHoy, turnosMes, clientesNuevos, clientesTotal, turnosSemana] = await Promise.all([
    prisma.turno.count({
      where: { tenantId, fechaHora: { gte: hoy, lte: finHoy }, estado: { not: 'CANCELADO' } },
    }),
    prisma.turno.findMany({
      where: {
        tenantId,
        fechaHora: { gte: inicioMes, lte: finMes },
        estado: { in: ['SENIADO', 'CONFIRMADO', 'COMPLETADO'] },
      },
      select: { montoSenia: true },
    }),
    prisma.cliente.count({
      where: { tenantId, creadoEn: { gte: hace7dias } },
    }),
    prisma.cliente.count({ where: { tenantId } }),
    prisma.turno.groupBy({
      by: ['fechaHora'],
      where: {
        tenantId,
        fechaHora: { gte: hace7dias, lte: hoy },
        estado: { not: 'CANCELADO' },
      },
      _count: true,
    }),
  ]);

  const ingresosMes = turnosMes.reduce((sum, t) => sum + (t.montoSenia || 0), 0);

  // Turnos by day for chart
  const turnosPorDia = [];
  for (let i = 6; i >= 0; i--) {
    const dia = new Date(hoy);
    dia.setDate(dia.getDate() - i);
    dia.setHours(0, 0, 0, 0);
    const diaFin = new Date(dia);
    diaFin.setHours(23, 59, 59, 999);

    const count = turnosSemana.filter(t => {
      const fecha = new Date(t.fechaHora);
      return fecha >= dia && fecha <= diaFin;
    }).reduce((sum, t) => sum + t._count, 0);

    turnosPorDia.push(count);
  }

  return {
    turnosHoy,
    clientesNuevos,
    clientesTotal,
    ingresosMes,
    turnosPorDia,
  };
}

export async function crearTurnoAdmin(tenantId, { servicioId, fechaHora, nombre, apellido, telefono, notas, estado, aDomicilio }) {
  const servicio = await prisma.servicio.findFirst({
    where: { id: servicioId, tenantId, activo: true },
  });

  if (!servicio) throw new Error('RECURSO_NO_ENCONTRADO');

  const fecha = new Date(fechaHora);

  // Create or find client
  const cliente = await prisma.cliente.upsert({
    where: { tenantId_telefono: { tenantId, telefono } },
    create: { tenantId, nombre, apellido, telefono },
    update: {},
  });

  const turno = await prisma.turno.create({
    data: {
      tenantId,
      servicioId,
      clienteId: cliente.id,
      fechaHora: fecha,
      duracion: servicio.duracionMinutos,
      estado: estado || 'CONFIRMADO',
      precioTotal: servicio.precio,
      montoSenia: 0,
      notas: notas || (aDomicilio ? 'Turno a domicilio' : null),
    },
    include: { servicio: true, cliente: true },
  });

  return turno;
}

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
  const turno = await prisma.turno.findUnique({
    where: { id: turnoId },
    include: { servicio: true, cliente: true },
  });

  if (!turno || turno.tenantId !== tenantId) {
    throw new Error('RECURSO_NO_ENCONTRADO');
  }

  const estadoAnterior = turno.estado;

  const result = await prisma.$transaction(async (tx) => {
    // Update turn status
    const updated = await tx.turno.update({
      where: { id: turnoId },
      data: { estado, notas },
      include: { servicio: true, cliente: true },
    });

    // Award points when turn is COMPLETED (if incentivos enabled and wasn't already completed)
    if (estado === 'COMPLETADO' && estadoAnterior !== 'COMPLETADO') {
      const tenant = await tx.tenant.findUnique({
        where: { id: tenantId },
        select: { config: true },
      });

      if (tenant?.config?.incentivosActivos !== false) {
        await tx.cliente.update({
          where: { id: turno.clienteId },
          data: { puntos: { increment: turno.servicio.puntosOtorgados || 1 } },
        });
      }
    }

    // Remove points if turn was completed and now is being cancelled
    if (estadoAnterior === 'COMPLETADO' && estado === 'CANCELADO') {
      await tx.cliente.update({
        where: { id: turno.clienteId },
        data: { puntos: { decrement: turno.servicio.puntosOtorgados || 1 } },
      });
    }

    return updated;
  });

  return result;
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
