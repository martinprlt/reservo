import prisma from '../config/prisma.js';

const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

export async function calcularSlotsLibres(tenantId, servicioId, fecha) {
  const servicio = await prisma.servicio.findFirst({
    where: { id: servicioId, tenantId },
  });

  if (!servicio) return [];

  // Parse fecha as local date
  let fechaParts;
  if (fecha instanceof Date) {
    fechaParts = [fecha.getFullYear(), fecha.getMonth() + 1, fecha.getDate()];
  } else {
    fechaParts = fecha.split('-').map(Number);
  }

  const fechaDate = new Date(fechaParts[0], fechaParts[1] - 1, fechaParts[2], 0, 0, 0, 0);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (fechaDate < hoy) return [];

  const variantes = servicio.variantes || [];
  const maxDuracionExtra = variantes.length > 0
    ? Math.max(0, ...variantes.map((v) => v.duracionExtra || 0))
    : 0;
  const duracionTotal = servicio.duracionMinutos + maxDuracionExtra;

  const nombreDia = DIAS_SEMANA[fechaDate.getDay()];
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { config: true },
  });

  const horarios = tenant.config?.horarios || {};
  const horario = horarios[nombreDia];

  if (!horario || !horario.activo) return [];

  const [aperturaH, aperturaM] = horario.apertura.split(':').map(Number);
  const [cierreH, cierreM] = horario.cierre.split(':').map(Number);

  const inicioDia = new Date(fechaParts[0], fechaParts[1] - 1, fechaParts[2], aperturaH, aperturaM, 0, 0);
  const finDia = new Date(fechaParts[0], fechaParts[1] - 1, fechaParts[2], cierreH, cierreM, 0, 0);

  const slots = [];
  let actual = new Date(inicioDia);

  // For today, skip past slots
  if (fechaDate.getTime() === hoy.getTime()) {
    const ahora = new Date();
    while (actual <= ahora) {
      actual = new Date(actual.getTime() + 30 * 60000);
    }
    // Round to next 30 min slot
    const mins = actual.getMinutes();
    if (mins % 30 !== 0) {
      actual.setMinutes(Math.ceil(mins / 30) * 30);
      actual.setSeconds(0, 0);
    }
  }

  // Generate slots
  while (actual.getTime() + duracionTotal * 60000 <= finDia.getTime()) {
    const slotFin = new Date(actual.getTime() + duracionTotal * 60000);
    slots.push({ inicio: new Date(actual), fin: slotFin });
    actual = new Date(actual.getTime() + 30 * 60000);
  }

  // Get blocking turnos
  const turnosBloqueantes = await prisma.turno.findMany({
    where: {
      tenantId,
      fechaHora: { gte: inicioDia, lte: finDia },
      estado: { in: ['RESERVADO', 'SENIADO', 'CONFIRMADO'] },
    },
    select: { fechaHora: true, duracion: true },
  });

  return slots.filter((slot) => {
    return !turnosBloqueantes.some((turno) => {
      const turnoFin = new Date(turno.fechaHora.getTime() + turno.duracion * 60000);
      return turno.fechaHora < slot.fin && turnoFin > slot.inicio;
    });
  });
}
