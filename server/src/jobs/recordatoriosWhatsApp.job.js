import cron from 'node-cron';
import prisma from '../config/prisma.js';
import logger from '../utils/logger.js';
import { enviarRecordatorio } from '../services/whatsappService.js';
import { notificarTurnoManana } from '../services/notificacionesService.js';

async function enviarRecordatorios24h() {
  try {
    const ahora = new Date();
    const manana = new Date(ahora);
    manana.setDate(manana.getDate() + 1);
    manana.setHours(0, 0, 0, 0);

    const mananaFin = new Date(manana);
    mananaFin.setHours(23, 59, 59, 999);

    // Find all confirmed/señado turns for tomorrow
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

    for (const turno of turnos) {
      const config = turno.tenant?.config || {};
      if (config.telefonoAdmin) {
        try {
          await enviarRecordatorio(turno);
          logger.info(`Recordatorio enviado para turno ${turno.id}`);
        } catch (err) {
          logger.warn(`Error enviando recordatorio para turno ${turno.id}: ${err.message}`);
        }
      }
    }

    if (turnos.length > 0) {
      logger.info(`Enviados ${turnos.length} recordatorios para mañana`);
    }
  } catch (error) {
    logger.error(`Error en job recordatorios: ${error.message}`);
  }
}

// Run every day at 9:00 AM
cron.schedule('0 9 * * *', enviarRecordatorios24h);

logger.info('Job de recordatorios WhatsApp iniciado (diario a las 9:00)');

export default cron;
