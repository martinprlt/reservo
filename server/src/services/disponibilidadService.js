import prisma from '../config/prisma.js';

const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

export async function calcularSlotsLibres(tenantId, servicioId, fecha) {
  const servicio = await prisma.servicio.findFirst({
    where: { id: servicioId, tenantId },
    include: { variante: { where: { activo: true } } },
  });

  if (!servicio) return [];

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaCheck = new Date(fecha);
  fechaCheck.setHours(0, 0, 0, 0);

  if (fechaCheck < hoy) return [];

  const maxDuracionExtra = Math.max(0, ...servicio.variante.map((v) => v.duracionExtra || 0));
  const duracionTotal = servicio.duracionMinutos + maxDuracionExtra;

  const nombreDia = DIAS_SEMANA[fecha.getDay()];
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { config: true },
  });

  const horarios = tenant.config?.horarios || {};
  const horario = horarios[nombreDia];

  if (!horario || !horario.activo) return [];

  const [aperturaH, aperturaM] = horario.apertura.split(':').map(Number);
  const [cierreH, cierreM] = horario.cierre.split(':').map(Number);

  const inicioDia = new Date(fecha);
  inicioDia.setHours(aperturaH, aperturaM, 0, 0);

  const finDia = new Date(fecha);
  finDia.setHours(cierreH, cierreM, 0, 0);

  const slots = [];
  let actual = new Date(inicioDia);

  if (fechaCheck.getTime() === hoy.getTime()) {
    const ahora = new Date();
    if (actual <= ahora) {
      actual = new Date(ahora);
      actual.setMinutes(actual.getMinutes() + 30);
      actual.setSeconds(0, 0);
    }
  }

  while (actual.getTime() + duracionTotal * 60000 <= finDia.getTime()) {
    const slotFin = new Date(actual.getTime() + duracionTotal * 60000);
    slots.push({ inicio: new Date(actual), fin: slotFin });
    actual = new Date(actual.getTime() + 30 * 60000);
  }

  const turnosBloqueantes = await prisma.turno.findMany({
    where: {
      tenantId,
      fechaHora: { gte: inicioDia, lte: finDia },
      estado: { in: ['RESERVADO', 'SENIADO', 'CONFIRMADO'] },
    },
    select: { fechaHora: true, duracionMinutos: true },
  });

  return slots.filter((slot) => {
    return !turnosBloqueantes.some((turno) => {
      const turnoFin = new Date(turno.fechaHora.getTime() + turno.duracionMinutos * 60000);
      return turno.fechaHora < slot.fin && turnoFin > slot.inicio;
    });
  });
}
