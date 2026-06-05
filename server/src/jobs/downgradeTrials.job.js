import cron from 'node-cron';
import prisma from '../config/prisma.js';
import logger from '../utils/logger.js';
import { acquireLock, releaseLock } from '../utils/lock.js';
import { track } from '../services/metricsService.js';

async function downgradeTrialsExpirados() {
  if (!acquireLock('downgradeTrials', 55 * 60 * 1000)) {
    return;
  }
  try {
    const ahora = new Date();

    const tenants = await prisma.tenant.findMany({
      where: {
        plan: { not: 'FREE' },
        trialFin: { lte: ahora },
        activo: true,
      },
    });

    for (const tenant of tenants) {
      const planAnterior = tenant.plan;
      await prisma.tenant.update({
        where: { id: tenant.id },
        data: { plan: 'FREE', trialFin: null },
      });

      track('DOWNGRADE', tenant.id, { desde: planAnterior, hacia: 'FREE', razon: 'trial_expirado' });
      logger.info(`Trial expirado: ${tenant.nombre} (${tenant.slug}) — ${planAnterior} → FREE`);
    }

    if (tenants.length > 0) {
      logger.info(`Downgrade automático: ${tenants.length} tenants`);
    }
  } catch (error) {
    logger.error(`Error en job downgradeTrials: ${error.message}`);
  } finally {
    releaseLock('downgradeTrials');
  }
}

// Run every hour
cron.schedule('0 * * * *', downgradeTrialsExpirados);

logger.info('Job de downgrade de trials iniciado (cada hora)');

export default cron;
