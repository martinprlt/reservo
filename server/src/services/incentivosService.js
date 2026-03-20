import prisma from '../config/prisma.js';

export async function listar(tenantId) {
  return prisma.incentivo.findMany({
    where: { tenantId, activo: true },
    orderBy: { puntosRequeridos: 'asc' },
  });
}

export async function crear(tenantId, { nombre, puntosRequeridos, tipoDescuento, valor }) {
  return prisma.incentivo.create({
    data: {
      tenantId,
      nombre,
      puntosRequeridos,
      tipoDescuento,
      valor,
    },
  });
}

export async function actualizar(tenantId, incentivoId, data) {
  const incentivo = await prisma.incentivo.findUnique({ where: { id: incentivoId } });

  if (!incentivo || incentivo.tenantId !== tenantId) {
    throw new Error('RECURSO_NO_ENCONTRADO');
  }

  return prisma.incentivo.update({
    where: { id: incentivoId },
    data,
  });
}

export async function eliminar(tenantId, incentivoId) {
  const incentivo = await prisma.incentivo.findUnique({ where: { id: incentivoId } });

  if (!incentivo || incentivo.tenantId !== tenantId) {
    throw new Error('RECURSO_NO_ENCONTRADO');
  }

  return prisma.incentivo.update({
    where: { id: incentivoId },
    data: { activo: false },
  });
}

export async function obtenerDescuentoDisponible(tenantId, puntosCliente) {
  const incentivo = await prisma.incentivo.findFirst({
    where: {
      tenantId,
      activo: true,
      puntosRequeridos: { lte: puntosCliente },
    },
    orderBy: { puntosRequeridos: 'desc' },
  });

  if (!incentivo) return null;

  return {
    incentivo,
    puntosRequeridos: incentivo.puntosRequeridos,
    tipoDescuento: incentivo.tipoDescuento,
    valor: incentivo.valor,
  };
}

export async function aplicarDescuento(montoOriginal, tenantId, clienteId) {
  const cliente = await prisma.cliente.findUnique({
    where: { id: clienteId },
    select: { puntos: true },
  });

  if (!cliente) return { montoFinal: montoOriginal, descuentoAplicado: 0 };

  const descuento = await obtenerDescuentoDisponible(tenantId, cliente.puntos);

  if (!descuento) return { montoFinal: montoOriginal, descuentoAplicado: 0 };

  let descuentoAplicado = 0;

  if (descuento.tipoDescuento === 'PORCENTAJE') {
    descuentoAplicado = montoOriginal * (descuento.valor / 100);
  } else if (descuento.tipoDescuento === 'MONTO_FIJO') {
    descuentoAplicado = descuento.valor;
  }

  descuentoAplicado = Math.min(descuentoAplicado, montoOriginal);

  return {
    montoFinal: montoOriginal - descuentoAplicado,
    descuentoAplicado,
    incentivo: descuento.incentivo,
  };
}
