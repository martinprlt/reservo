import prisma from '../config/prisma.js';

export async function obtenerReporteTurnos(tenantId, { desde, hasta, estado }) {
  const where = { tenantId };

  if (desde && hasta) {
    where.fechaHora = { gte: new Date(desde), lte: new Date(hasta) };
  }

  if (estado) {
    where.estado = estado;
  }

  const turnos = await prisma.turno.findMany({
    where,
    include: { cliente: true, servicio: true, pagos: true },
    orderBy: { fechaHora: 'desc' },
  });

  const stats = {
    total: turnos.length,
    porEstado: {},
    totalGanancias: 0,
    totalSenias: 0,
    serviciosMasPopulares: {},
  };

  turnos.forEach(t => {
    // Count by estado
    stats.porEstado[t.estado] = (stats.porEstado[t.estado] || 0) + 1;

    // Sum ganancias (only completed and seniado)
    if (['SENIADO', 'CONFIRMADO', 'COMPLETADO'].includes(t.estado)) {
      stats.totalSenias += t.montoSenia || 0;
    }

    // Count servicios populares
    const nombreServicio = t.servicio?.nombre || 'Desconocido';
    stats.serviciosMasPopulares[nombreServicio] = (stats.serviciosMasPopulares[nombreServicio] || 0) + 1;
  });

  // Convert serviciosMasPopulares to sorted array
  stats.serviciosMasPopulares = Object.entries(stats.serviciosMasPopulares)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);

  return { turnos, stats };
}

export async function obtenerReporteGanancias(tenantId, { desde, hasta }) {
  const where = {
    tenantId,
    estado: { in: ['SENIADO', 'CONFIRMADO', 'COMPLETADO'] },
  };

  if (desde && hasta) {
    where.fechaHora = { gte: new Date(desde), lte: new Date(hasta) };
  }

  const turnos = await prisma.turno.findMany({
    where,
    select: {
      fechaHora: true,
      montoSenia: true,
      precioTotal: true,
      estado: true,
      servicio: { select: { nombre: true } },
      pagos: { select: { monto: true, metodoPago: true } },
    },
    orderBy: { fechaHora: 'desc' },
  });

  const stats = {
    totalSenias: 0,
    totalPrecios: 0,
    porMetodoPago: { MP: 0, MANUAL: 0 },
    porMes: {},
  };

  turnos.forEach(t => {
    const esCompletado = t.estado === 'COMPLETADO';
    stats.totalSenias += t.montoSenia || 0;
    stats.totalPrecios += t.precioTotal || 0;

    // Count by payment method
    t.pagos.forEach(p => {
      if (p.metodoPago === 'MP') {
        stats.porMetodoPago.MP += p.monto || 0;
      } else if (p.metodoPago === 'MANUAL') {
        stats.porMetodoPago.MANUAL += p.monto || 0;
      }
    });

    // Group by month - use precioTotal for completed, montoSenia for pending
    const mes = new Date(t.fechaHora).toISOString().substring(0, 7); // YYYY-MM
    const monto = esCompletado ? (t.precioTotal || 0) : (t.montoSenia || 0);
    stats.porMes[mes] = (stats.porMes[mes] || 0) + monto;
  });

  return { turnos, stats };
}

export async function obtenerReporteTrabajos(tenantId, { desde, hasta }) {
  const where = {
    tenantId,
    estado: 'COMPLETADO',
  };

  if (desde && hasta) {
    where.fechaHora = { gte: new Date(desde), lte: new Date(hasta) };
  }

  const trabajos = await prisma.turno.findMany({
    where,
    include: { cliente: true, servicio: true },
    orderBy: { fechaHora: 'desc' },
  });

  const stats = {
    totalCompletados: trabajos.length,
    porServicio: {},
    porCliente: {},
  };

  trabajos.forEach(t => {
    // Count by servicio
    const nombreServicio = t.servicio?.nombre || 'Desconocido';
    stats.porServicio[nombreServicio] = (stats.porServicio[nombreServicio] || 0) + 1;

    // Count by cliente
    const nombreCliente = `${t.cliente?.nombre || ''} ${t.cliente?.apellido || ''}`.trim();
    stats.porCliente[nombreCliente] = (stats.porCliente[nombreCliente] || 0) + 1;
  });

  // Convert to sorted arrays
  stats.porServicio = Object.entries(stats.porServicio)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad);

  stats.porCliente = Object.entries(stats.porCliente)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 10);

  return { trabajos, stats };
}
