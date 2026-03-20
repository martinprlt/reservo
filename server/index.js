import 'dotenv/config';
import './src/jobs/liberarReservas.job.js';
import './src/jobs/recordatoriosWhatsApp.job.js';
import app from './app.js';
import env from './src/config/env.js';
import logger from './src/utils/logger.js';
import prisma from './src/config/prisma.js';

async function main() {
  try {
    await prisma.$connect();
    logger.info('Database connected');

    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

main();
