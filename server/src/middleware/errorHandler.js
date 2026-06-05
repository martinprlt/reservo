import * as Sentry from '@sentry/node';
import logger from '../utils/logger.js';

export default function errorHandler(err, req, res, next) {
  // Send to Sentry in production
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    Sentry.captureException(err);
  }

  // Log the error
  if (process.env.NODE_ENV === 'production') {
    logger.error(err.message);
  } else {
    logger.error(err.stack);
  }

  // Map error codes to HTTP status codes
  const errorCodes = {
    CREDENCIALES_INVALIDAS: 401,
    NO_AUTORIZADO: 401,
    RECURSO_NO_ENCONTRADO: 404,
    SLOT_NO_DISPONIBLE: 409,
    RESERVA_EXPIRADA: 410,
    VALIDATION_ERROR: 400,
    RATE_LIMIT_EXCEEDED: 429,
    LIMITE_TURNOS_MES_ALCANZADO: 429,
    LIMITE_SERVICIOS_ALCANZADO: 429,
    NO_SE_PUEDE_CANCELAR: 400,
    SLUG_YA_EXISTE: 409,
    EMAIL_YA_REGISTRADO: 409,
  };

  const status = errorCodes[err.message] || 500;

  // In production, don't expose internal error details
  const message = status === 500 ? 'Error interno del servidor' : err.message;

  // Don't leak stack traces in production
  const response = { error: message };
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(status).json(response);
}
