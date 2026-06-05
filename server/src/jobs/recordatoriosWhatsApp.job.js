import cron from 'node-cron';
import prisma from '../config/prisma.js';
import logger from '../utils/logger.js';
import { enviarRecordatorio } from '../services/whatsappService.js';
import { notificarTurnoManana } from '../services/notificacionesService.js';
import { acquireLock, releaseLock } from '../utils/lock.js';

async function enviarRecordatorios24h() {
  if (!acquireLock('recordatorios', 55 * 60 * 1000)) {
    return; // Another instance is running this job
  }
  try {
    const ahora = new Date();
    const manana = new Date(ahora);
    manana.setDate(manana.getDate() + 1);
    manana.setHours(0, 0, 0, 0);

    const mananaFin = new Date(manana);
    mananaFin.setHours(23, 59, 59, 999);

    const turnos = await prisma.turno.findMany({
      where: {
        fechaHora: { gte: manana, lte: mananaFin },
        estado: { in: ['SENIADO', 'CONFIRMADO'] },
      },
      include: {
        cliente: true,
        servicio: true,
        tenant: true,
      },
    });

    let enviados = 0;

    for (const turno of turnos) {
      // In-app notification for admin
      try {
        await notificarTurnoManana(turno.tenantId, turno);
      } catch {}

      // WhatsApp to client (always, regardless of admin phone)
      try {
        await enviarRecordatorio(turno);
        enviados++;
      } catch (err) {
        logger.warn(`Error enviando recordatorio para turno ${turno.id}: ${err.message}`);
      }
    }

    if (turnos.length > 0) {
      logger.info(`Recordatorios: ${enviados}/${turnos.length} WhatsApp enviados, ${turnos.length} in-app notificaciones`);
    }
  } catch (error) {
    logger.error(`Error en job recordatorios: ${error.message}`);
  } finally {
    releaseLock('recordatorios');
  }
}

// Run every day at 9:00 AM
cron.schedule('0 9 * * *', enviarRecordatorios24h);

logger.info('Job de recordatorios WhatsApp iniciado (diario a las 9:00)');

export default cron;
