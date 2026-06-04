import prisma from '../config/prisma.js';

export async function listar(tenantId) {
  return prisma.servicio.findMany({
    where: { tenantId, activo: true },
    orderBy: { nombre: 'asc' },
  });
}

export async function crear(tenantId, { nombre, descripcion, rubro, duracionMinutos, precio, montoSenia, puntosOtorgados, variantes, foto }) {
  return prisma.servicio.create({
    data: {
      tenantId,
      nombre,
      descripcion: descripcion || null,
      rubro: rubro || 'general',
      duracionMinutos,
      precio,
      montoSenia: montoSenia || Math.round(precio * 0.3),
      puntosOtorgados: puntosOtorgados || 1,
      variantes: variantes || [],
      foto: foto || null,
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
    data: {
      ...data,
      foto: data.foto ?? undefined, // Handle null/undefined correctly
    },
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
