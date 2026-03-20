import prisma from '../config/prisma.js';
import logger from '../utils/logger.js';

export async function procesarPagoAprobado(turnoId, mpPaymentId) {
  try {
    await prisma.$transaction(async (tx) => {
      const turno = await tx.turno.findUnique({ where: { id: turnoId } });
      if (!turno || turno.estado !== 'RESERVADO') return;

      await tx.turno.update({
        where: { id: turnoId },
        data: { estado: 'SENIADO', expiraEn: null },
      });

      await tx.pago.create({
        data: {
          turnoId,
          monto: 0,
          mpPaymentId: mpPaymentId.toString(),
          mpStatus: 'approved',
          mpDateApproved: new Date(),
        },
      });

      await tx.cliente.update({
        where: { id: turno.clienteId },
        data: { puntos: { increment: 1 } },
      });
    });
  } catch (error) {
    logger.warn(`Error al procesar pago ${mpPaymentId}: ${error.message}`);
  }
}
