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

    const server = app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logger.warn(`Port ${env.PORT} in use, trying ${env.PORT + 1}`);
        const server2 = app.listen(env.PORT + 1, () => {
          logger.info(`Server running on port ${env.PORT + 1}`);
        });
        server2.on('error', (e) => {
          logger.error(`Failed to start: ${e.message}`);
          process.exit(1);
        });
      } else {
        logger.error(`Server error: ${err.message}`);
        process.exit(1);
      }
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

main();
