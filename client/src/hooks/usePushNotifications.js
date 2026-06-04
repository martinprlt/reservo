import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';

const VAPID_PUBLIC_KEY = null; // Fetched from backend

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setSupported(true);
    } else {
      setLoading(false);
    }
  }, []);

  // Check subscription status
  useEffect(() => {
    if (!supported) return;

    async function checkSubscription() {
      try {
        const reg = await navigator.serviceWorker.ready;
        const subscription = await reg.pushManager.getSubscription();
        setSubscribed(!!subscription);
      } catch {}
      setLoading(false);
    }

    checkSubscription();
  }, [supported]);

  const subscribe = useCallback(async () => {
    if (!supported) return false;

    try {
      // Get VAPID key from backend
      const { data } = await api.get('/push/vapid-public-key');
      const publicKey = data.publicKey;

      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const sub = subscription.toJSON();
      await api.post('/push/subscribe', {
        endpoint: sub.endpoint,
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth,
      });

      setSubscribed(true);

      // Show welcome notification
      if (' Notification' in window && Notification.permission === 'granted') {
        new Notification('¡Notificaciones activadas!', {
          body: 'Recibirás alertas cuando tus clientes reserven turnos.',
          icon: '/icon.png',
        });
      }

      return true;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return false;
    }
  }, [supported]);

  const unsubscribe = useCallback(async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.getSubscription();
      if (subscription) {
        await api.post('/push/unsubscribe', { endpoint: subscription.endpoint });
        await subscription.unsubscribe();
        setSubscribed(false);
      }
    } catch (error) {
      console.error('Push unsubscribe failed:', error);
    }
  }, []);

  return { supported, subscribed, loading, subscribe, unsubscribe };
}
