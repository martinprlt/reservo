import prisma from '../../config/prisma.js';

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
        include: { servicio: true },
        orderBy: { fechaHora: 'desc' },
      },
    },
  });

  if (!cliente || cliente.tenantId !== tenantId) {
    throw new Error('RECURSO_NO_ENCONTRADO');
  }

  return cliente;
}

export async function listar(tenantId, { page = 1, limit = 20, busqueda }) {
  const skip = (page - 1) * limit;

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
      take: limit,
      orderBy: { creadoEn: 'desc' },
    }),
    prisma.cliente.count({ where }),
  ]);

  return { clientes, total, page, limit, pages: Math.ceil(total / limit) };
}
