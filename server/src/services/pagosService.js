import prisma from '../config/prisma.js';
import logger from '../utils/logger.js';
import { enviarConfirmacionTurno } from './whatsappService.js';
import { notificarPagoRecibido } from './notificacionesService.js';
import { enviarPushAdmin } from './pushService.js';

export async function procesarPagoAprobado(turnoId, mpPaymentId) {
  try {
    const resultado = await prisma.$transaction(async (tx) => {
      const turno = await tx.turno.findUnique({
        where: { id: turnoId },
        include: { cliente: true, servicio: true, tenant: true },
      });

      if (!turno) throw new Error('RECURSO_NO_ENCONTRADO');
      if (turno.estado !== 'RESERVADO') return turno;

      await tx.turno.update({
        where: { id: turnoId },
        data: { estado: 'SENIADO', expiraEn: null },
      });

      await tx.pago.create({
        data: {
          turnoId,
          mpPaymentId: mpPaymentId.toString(),
          monto: turno.montoSenia,
          estado: 'APROBADO',
          fechaPago: new Date(),
          metodoPago: 'MP',
        },
      });

      // Points are awarded when the turn is COMPLETED, not here
      return turno;
    });

    await enviarConfirmacionTurno(resultado);

    // Create notification for admin + push
    try {
      await notificarPagoRecibido(resultado.tenantId, resultado);
    } catch {}
    try {
      await enviarPushAdmin(resultado.tenantId, {
        title: '💰 Seña recibida',
        body: `${resultado.cliente.nombre} $${resultado.montoSenia?.toLocaleString('es-AR')} — ${resultado.servicio.nombre}`,
        tag: 'pago-recibido',
      });
    } catch {}

    return resultado;
  } catch (error) {
    logger.warn(`Error al procesar pago ${mpPaymentId} para turno ${turnoId}: ${error.message}`);
    throw error;
  }
}
