import prisma from '../config/prisma.js';
import { getPlanLimits } from '../config/plans.js';

export async function listar(tenantId) {
  return prisma.servicio.findMany({
    where: { tenantId, activo: true },
    orderBy: { nombre: 'asc' },
  });
}

export async function crear(tenantId, { nombre, descripcion, rubro, duracionMinutos, precio, montoSenia, puntosOtorgados, variantes, foto }) {
  // Check plan limit
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId }, select: { plan: true } });
  const limits = getPlanLimits(tenant?.plan);

  if (limits.maxServicios !== Infinity) {
    const count = await prisma.servicio.count({ where: { tenantId, activo: true } });
    if (count >= limits.maxServicios) {
      throw new Error('LIMITE_SERVICIOS_ALCANZADO');
    }
  }

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
