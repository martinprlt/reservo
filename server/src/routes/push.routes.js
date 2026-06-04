import { Router } from 'express';
import verifyJWT from '../middleware/auth.js';
import { subscribe, unsubscribe, getVapidPublicKey } from '../services/pushService.js';

const router = Router();

router.get('/vapid-public-key', (req, res) => {
  const key = getVapidPublicKey();
  if (!key) {
    return res.status(503).json({ error: 'Push notifications no configuradas' });
  }
  res.json({ publicKey: key });
});

router.post('/subscribe', verifyJWT, async (req, res) => {
  try {
    const { endpoint, p256dh, auth } = req.body;
    if (!endpoint || !p256dh || !auth) {
      return res.status(400).json({ error: 'Datos de suscripción incompletos' });
    }
    await subscribe(req.tenantId, { endpoint, p256dh, auth });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/unsubscribe', verifyJWT, async (req, res) => {
  try {
    const { endpoint } = req.body;
    await unsubscribe(req.tenantId, endpoint);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
