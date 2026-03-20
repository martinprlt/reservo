import prisma from '../config/prisma.js';

export async function identificarOCrear(tenantId, telefono, nombre, apellido) {
  const cliente = await prisma.cliente.findUnique({
    where: { tenantId_telefono: { tenantId, telefono } },
    include: { turnos: { orderBy: { fechaHora: 'desc' }, take: 5 } },
  });

  if (cliente) {
    return cliente;
  }

  return prisma.cliente.create({
    data: { tenantId, telefono, nombre, apellido },
  });
}

export async function obtenerPorId(tenantId, clienteId) {
  const cliente = await prisma.cliente.findUnique({
    where: { id: clienteId },
    include: {
      turnos: {
        include: { servicio: true, pagos: true },
        orderBy: { fechaHora: 'desc' },
      },
    },
  });

  if (!cliente || cliente.tenantId !== tenantId) {
    throw new Error('RECURSO_NO_ENCONTRADO');
  }

  const incentivos = await prisma.incentivo.findMany({
    where: { tenantId, activo: true },
    orderBy: { puntosRequeridos: 'asc' },
  });

  const proximoIncentivo = incentivos.find(i => i.puntosRequeridos > cliente.puntos);

  return {
    ...cliente,
    stats: {
      totalTurnos: cliente.turnos.length,
      completados: cliente.turnos.filter(t => t.estado === 'COMPLETADO').length,
      cancelados: cliente.turnos.filter(t => t.estado === 'CANCELADO').length,
      totalGastado: cliente.turnos.filter(t => ['SENIADO', 'CONFIRMADO', 'COMPLETADO'].includes(t.estado))
        .reduce((sum, t) => sum + t.montoSenia, 0),
    },
    incentivosDisponibles: incentivos.filter(i => i.puntosRequeridos <= cliente.puntos),
    proximoIncentivo,
    puntosParaProximo: proximoIncentivo ? proximoIncentivo.puntosRequeridos - cliente.puntos : 0,
  };
}

export async function listar(tenantId, { page = 1, limit = 20, busqueda }) {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 20;
  const skip = (pageNum - 1) * limitNum;

  const where = { tenantId };
  if (busqueda) {
    where.OR = [
      { nombre: { contains: busqueda, mode: 'insensitive' } },
      { apellido: { contains: busqueda, mode: 'insensitive' } },
      { telefono: { contains: busqueda } },
    ];
  }

  const [clientes, total] = await Promise.all([
    prisma.cliente.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { creadoEn: 'desc' },
    }),
    prisma.cliente.count({ where }),
  ]);

  return { clientes, total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) };
}

export async function verificarPuntos(tenantId, telefono) {
  // Check if incentivos are enabled
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { config: true },
  });

  if (tenant?.config?.incentivosActivos === false) {
    return { encontrado: true, incentivosActivos: false, puntos: 0, nombre: null, incentivosDisponibles: [], proximoIncentivo: null, puntosParaProximo: 0 };
  }

  const cliente = await prisma.cliente.findUnique({
    where: { tenantId_telefono: { tenantId, telefono } },
    select: { id: true, nombre: true, apellido: true, puntos: true },
  });

  if (!cliente) {
    return { encontrado: false, incentivosActivos: true, puntos: 0, nombre: null };
  }

  const incentivos = await prisma.incentivo.findMany({
    where: { tenantId, activo: true },
    orderBy: { puntosRequeridos: 'asc' },
  });

  const proximoIncentivo = incentivos.find(i => i.puntosRequeridos > cliente.puntos);

  return {
    encontrado: true,
    incentivosActivos: true,
    nombre: `${cliente.nombre} ${cliente.apellido}`,
    puntos: cliente.puntos,
    incentivosDisponibles: incentivos.filter(i => i.puntosRequeridos <= cliente.puntos),
    proximoIncentivo,
    puntosParaProximo: proximoIncentivo ? proximoIncentivo.puntosRequeridos - cliente.puntos : 0,
  };
}
