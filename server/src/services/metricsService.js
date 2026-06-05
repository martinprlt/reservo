import prisma from '../config/prisma.js';

export async function track(tipo, tenantId = null, detalle = null) {
  try {
    await prisma.metric.create({
      data: { tipo, tenantId, detalle },
    });
  } catch {
    // Never block the main flow
  }
}

export async function obtenerMetricas({ desde, hasta }) {
  const where = {};
  if (desde || hasta) {
    where.creadoEn = {};
    if (desde) where.creadoEn.gte = new Date(desde);
    if (hasta) where.creadoEn.lte = new Date(hasta);
  }

  const [registros, upgrades, downgrades, turnos, pagos] = await Promise.all([
    prisma.metric.count({ where: { ...where, tipo: 'REGISTRO' } }),
    prisma.metric.count({ where: { ...where, tipo: 'UPGRADE' } }),
    prisma.metric.count({ where: { ...where, tipo: 'DOWNGRADE' } }),
    prisma.metric.count({ where: { ...where, tipo: 'TURNO_CREADO' } }),
    prisma.metric.count({ where: { ...where, tipo: 'PAGO_APROBADO' } }),
  ]);

  return { registros, upgrades, downgrades, turnos, pagos };
}

export async function registrosPorDia({ dias = 30 } = {}) {
  const desde = new Date();
  desde.setDate(desde.getDate() - dias);

  const metrics = await prisma.metric.findMany({
    where: { tipo: 'REGISTRO', creadoEn: { gte: desde } },
    select: { creadoEn: true },
    orderBy: { creadoEn: 'asc' },
  });

  // Group by day
  const days = {};
  for (let i = 0; i < dias; i++) {
    const d = new Date(desde);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    days[key] = 0;
  }

  for (const m of metrics) {
    const key = m.creadoEn.toISOString().slice(0, 10);
    if (days[key] !== undefined) days[key]++;
  }

  return Object.entries(days).map(([fecha, count]) => ({ fecha, count }));
}
