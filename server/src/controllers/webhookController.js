import { confirmarPago } from '../services/turnosService.js';

function verifySignature(req) {
  const crypto = require('crypto');
  const sig = req.headers['x-signature'];
  const reqId = req.headers['x-request-id'];
  const dataId = req.query['data.id'];

  if (!sig || !dataId) return false;

  const ts = sig.match(/ts=(\d+)/)?.[1];
  const v1 = sig.match(/v1=([a-f0-9]+)/)?.[1];

  if (!ts || !v1) return false;

  const manifest = `id:${dataId};request-id:${reqId};ts:${ts};`;
  const expected = crypto.createHmac('sha256', process.env.MP_WEBHOOK_SECRET)
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

    if (!verifySignature(req)) return;

    const { type, data } = req.body;
    if (type !== 'payment') return;

    try {
      const MercadoPago = await import('mercadopago');
      const mpClient = new MercadoPago.MercadoPagoConfig({ 
        accessToken: process.env.MP_ACCESS_TOKEN 
      });
      const payment = await new mpClient.Payment().get({ id: data.id });

      if (payment.status !== 'approved') return;

      const turnoId = payment.external_reference;
      if (!turnoId) return;

      await confirmarPago(turnoId, data.id);
    } catch (error) {
      console.error('Error procesando webhook MP:', error.message);
    }
  },
};
