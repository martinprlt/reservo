import logger from '../utils/logger.js';

export default function errorHandler(err, req, res, next) {
  if (process.env.NODE_ENV === 'production') {
    logger.error(err.message);
  } else {
    logger.error(err.stack);
  }

  const errorCodes = {
    CREDENCIALES_INVALIDAS: 401,
    NO_AUTORIZADO: 401,
    RECURSO_NO_ENCONTRADO: 404,
    SLOT_NO_DISPONIBLE: 409,
    RESERVA_EXPIRADA: 410,
    VALIDATION_ERROR: 400,
    RATE_LIMIT_EXCEEDED: 429,
  };

  const status = errorCodes[err.message] || 500;
  const message = status === 500 ? 'Error interno' : err.message;

  res.status(status).json({ error: message });
}
