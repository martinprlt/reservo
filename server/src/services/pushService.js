import webpush from 'web-push';
import prisma from '../config/prisma.js';
import logger from '../utils/logger.js';

// Generate VAPID keys once: run `npx web-push generate-vapid-keys` and set env vars
// For development, we generate them on first run and store in env
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:admin@slotifyapp.site',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

export function getVapidPublicKey() {
  return VAPID_PUBLIC_KEY;
}

export async function subscribe(tenantId, subscription) {
  const { endpoint, p256dh, auth } = subscription;

  // Upsert: if endpoint exists, reactivate; otherwise create
  return prisma.pushSubscription.upsert({
    where: { tenantId_endpoint: { tenantId, endpoint } },
    create: { tenantId, endpoint, p256dh, auth, activa: true },
    update: { activa: true, p256dh, auth },
  });
}

export async function unsubscribe(tenantId, endpoint) {
  return prisma.pushSubscription.updateMany({
    where: { tenantId, endpoint },
    data: { activa: false },
  });
}

export async function enviarPushAdmin(tenantId, { title, body, tag, url }) {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    logger.warn('VAPID keys no configuradas — push notifications deshabilitadas');
    return 0;
  }

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { tenantId, activa: true },
  });

  if (subscriptions.length === 0) return 0;

  const payload = JSON.stringify({
    title,
    body,
    tag: tag || 'slotify',
    data: { url: url || '/admin' },
  });

  let enviados = 0;
  const aEliminar = [];

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      );
      enviados++;
    } catch (error) {
      // Subscription expired or invalid — mark for deletion
      if (error.statusCode === 404 || error.statusCode === 410) {
        aEliminar.push(sub.id);
      } else {
        logger.warn(`Push notification error for ${sub.id}: ${error.message}`);
      }
    }
  }

  // Clean up invalid subscriptions
  if (aEliminar.length > 0) {
    await prisma.pushSubscription.deleteMany({
      where: { id: { in: aEliminar } },
    });
  }

  return enviados;
}
