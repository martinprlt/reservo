import cron from 'node-cron';
import prisma from '../config/prisma.js';
import logger from '../utils/logger.js';

async function liberarReservasExpiradas() {
  try {
    const ahora = new Date();

    const resultado = await prisma.turno.updateMany({
      where: {
        estado: 'RESERVADO',
        expiraEn: { lte: ahora },
      },
      data: { estado: 'CANCELADO' },
    });

    if (resultado.count > 0) {
      logger.info(`Liberadas ${resultado.count} reservas expiradas`);
    }
  } catch (error) {
    logger.error(`Error en job liberarReservas: ${error.message}`);
  }
}

cron.schedule('*/5 * * * *', liberarReservasExpiradas);

logger.info('Job de liberar reservas expiradas iniciado (cada 5 min)');

export default cron;
