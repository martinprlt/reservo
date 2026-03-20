import prisma from '../config/prisma.js';

export async function exportarClientesCSV(tenantId) {
  const clientes = await prisma.cliente.findMany({
    where: { tenantId },
    orderBy: { creadoEn: 'desc' },
  });

  const header = 'Nombre,Apellido,Teléfono,Puntos,Fecha Alta\n';
  const rows = clientes.map(c =>
    `"${c.nombre}","${c.apellido}","${c.telefono}",${c.puntos},"${c.creadoEn.toISOString()}"`
  ).join('\n');

  return header + rows;
}

export async function exportarTurnosCSV(tenantId, desde, hasta) {
  const where = { tenantId };

  if (desde && hasta) {
    where.fechaHora = { gte: new Date(desde), lte: new Date(hasta) };
  }

  const turnos = await prisma.turno.findMany({
    where,
    include: { cliente: true, servicio: true },
    orderBy: { fechaHora: 'desc' },
  });

  const header = 'Fecha,Hora,Cliente,Servicio,Estado,Precio,Seña\n';
  const rows = turnos.map(t => {
    const fecha = new Date(t.fechaHora);
    const fechaStr = fecha.toISOString().split('T')[0];
    const horaStr = fecha.toISOString().split('T')[1].substring(0, 5);
    return `"${fechaStr}","${horaStr}","${t.cliente.nombre} ${t.cliente.apellido}","${t.servicio.nombre}","${t.estado}",${t.precioTotal},${t.montoSenia}`;
  }).join('\n');

  return header + rows;
}
