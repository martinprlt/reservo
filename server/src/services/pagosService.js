import prisma from '../config/prisma.js';
import logger from '../utils/logger.js';
import notificacionesService from './notificacionesService.js';

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
        },
      });

      await tx.cliente.update({
        where: { id: turno.clienteId },
        data: { puntos: { increment: 1 } },
      });

      return turno;
    });

    await notificacionesService.enviarConfirmacionTurno(resultado);

    return resultado;
  } catch (error) {
    logger.warn(`Error al procesar pago ${mpPaymentId} para turno ${turnoId}: ${error.message}`);
    throw error;
  }
}
