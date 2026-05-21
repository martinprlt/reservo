import logger from '../utils/logger.js';

// This file is deprecated. Payment processing is handled by pagosService.js
// Kept for backwards compatibility reference only.

export async function procesarPagoAprobado(turnoId, mpPaymentId) {
  logger.warn('webhookService.procesarPagoAprobado is deprecated, use pagosService instead');
  // Redirect to the correct service
  return import('./pagosService.js').then(({ procesarPagoAprobado }) => {
    return procesarPagoAprobado(turnoId, mpPaymentId);
  });
}
