import { confirmarPago } from '../services/turnosService.js';
import prisma from '../config/prisma.js';

async function verifySignature(req, mpWebhookSecret) {
  const crypto = await import('crypto');
  const sig = req.headers['x-signature'];
  const reqId = req.headers['x-request-id'];
  const dataId = req.query['data.id'];

  if (!sig || !dataId) return false;

  const ts = sig.match(/ts=(\d+)/)?.[1];
  const v1 = sig.match(/v1=([a-f0-9]+)/)?.[1];

  if (!ts || !v1) return false;

  const secret = mpWebhookSecret || process.env.MP_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('WARNING: MP_WEBHOOK_SECRET not configured — rejecting webhook');
    return false;
  }

  const manifest = `id:${dataId};request-id:${reqId};ts:${ts};`;
  const expected = crypto.createHmac('sha256', secret)
    .update(manifest).digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(v1), Buffer.from(expected));
  } catch {
    return false;
  }
}

export default {
  async mp(req, res) {
    res.status(200).json({ received: true });

    const { type, data } = req.body;
    if (type !== 'payment' || !data?.id) return;

    try {
      const { MercadoPagoConfig } = await import('mercadopago');

      // Try to find the turn first using external_reference
      // We need to fetch the payment to get the external_reference
      // Use global MP token to fetch the payment
      const mpToken = process.env.MP_ACCESS_TOKEN;
      if (!mpToken) return;

      const mpClient = new MercadoPagoConfig({ accessToken: mpToken });
      const payment = await new mpClient.Payment().get({ id: data.id });

      if (payment.status !== 'approved') return;

      const turnoId = payment.external_reference;
      if (!turnoId) return;

      // Find the turn and its tenant to get tenant's MP credentials
      const turno = await prisma.turno.findUnique({
        where: { id: turnoId },
        include: { tenant: true },
      });

      if (!turno) return;

      // Verify signature with tenant's webhook secret if configured
      const isValid = await verifySignature(req, turno.tenant?.config?.mpWebhookSecret);
      if (!isValid) return;

      // Confirm the payment
      await confirmarPago(turnoId, data.id);
    } catch (error) {
      console.error('Error procesando webhook MP:', error.message);
    }
  },
};
