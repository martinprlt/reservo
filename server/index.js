import 'dotenv/config';

// Set timezone to Argentina for consistent date handling
process.env.TZ = process.env.TZ || 'America/Argentina/Buenos_Aires';

// Initialize Sentry for error tracking
import * as Sentry from '@sentry/node';
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 0.1,
  });
}

import './src/jobs/liberarReservas.job.js';
import './src/jobs/recordatoriosWhatsApp.job.js';
import './src/jobs/downgradeTrials.job.js';
import app from './app.js';
import env from './src/config/env.js';
import logger from './src/utils/logger.js';
import prisma from './src/config/prisma.js';

async function main() {
  let server;

  // Retry DB connection (Render free tier DB sleeps after inactivity)
  let connected = false;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      await prisma.$connect();
      connected = true;
      logger.info('Database connected');
      break;
    } catch (err) {
      logger.warn(`DB connection attempt ${attempt}/5 failed: ${err.message}`);
      if (attempt < 5) {
        await new Promise(r => setTimeout(r, 10000));
      }
    }
  }

  if (!connected) {
    logger.error('Could not connect to database after 5 attempts');
    process.exit(1);
  }

  try {
    server = app.listen(env.PORT, () => {
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

  // Graceful shutdown
  const shutdown = async (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    if (server) {
      server.close(() => {
        logger.info('HTTP server closed');
      });
    }
    // Wait up to 10s for connections to drain
    const forceExit = setTimeout(() => {
      logger.warn('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
    forceExit.unref();

    try {
      await prisma.$disconnect();
      logger.info('Database disconnected');
      clearTimeout(forceExit);
      process.exit(0);
    } catch (err) {
      logger.error(`Error during shutdown: ${err.message}`);
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main();
