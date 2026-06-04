import prisma from '../config/prisma.js';

function escapeCSV(value) {
  const str = String(value ?? '');
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function exportarClientesCSV(tenantId) {
  const clientes = await prisma.cliente.findMany({
    where: { tenantId },
    orderBy: { creadoEn: 'desc' },
  });

  const header = 'Nombre,Apellido,Teléfono,Puntos,Fecha Alta\n';
  const rows = clientes.map(c =>
    [escapeCSV(c.nombre), escapeCSV(c.apellido), escapeCSV(c.telefono), c.puntos, escapeCSV(c.creadoEn.toISOString())].join(',')
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
    const cliente = `${t.cliente.nombre} ${t.cliente.apellido}`;
    return [escapeCSV(fechaStr), escapeCSV(horaStr), escapeCSV(cliente), escapeCSV(t.servicio.nombre), escapeCSV(t.estado), t.precioTotal, t.montoSenia].join(',');
  }).join('\n');

  return header + rows;
}
