import prisma from '../config/prisma.js';

export async function listar(tenantId) {
  return prisma.servicio.findMany({
    where: { tenantId, activo: true },
    orderBy: { nombre: 'asc' },
  });
}

export async function crear(tenantId, { nombre, rubro, duracionMinutos, precio, montoSenia, variantes }) {
  return prisma.servicio.create({
    data: {
      tenantId,
      nombre,
      rubro: rubro || 'general',
      duracionMinutos,
      precio,
      montoSenia: montoSenia || Math.round(precio * 0.3),
      variantes: variantes || [],
    },
  });
}

export async function actualizar(tenantId, servicioId, data) {
  const servicio = await prisma.servicio.findUnique({ where: { id: servicioId } });

  if (!servicio || servicio.tenantId !== tenantId) {
    throw new Error('RECURSO_NO_ENCONTRADO');
  }

  return prisma.servicio.update({
    where: { id: servicioId },
    data,
  });
}

export async function eliminar(tenantId, servicioId) {
  const servicio = await prisma.servicio.findUnique({ where: { id: servicioId } });

  if (!servicio || servicio.tenantId !== tenantId) {
    throw new Error('RECURSO_NO_ENCONTRADO');
  }

  return prisma.servicio.update({
    where: { id: servicioId },
    data: { activo: false },
  });
}
