import crypto from 'crypto';

export function verifyMPSignature(req) {
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

  return crypto.timingSafeEqual(Buffer.from(v1), Buffer.from(expected));
}
