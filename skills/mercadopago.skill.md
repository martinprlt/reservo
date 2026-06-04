# Skill: Slotify — Integración MercadoPago

## Modelo: Checkout Pro

Se usa MercadoPago Checkout Pro (no API). El cliente es
redirigido a la página de MP para pagar. Esto evita toda
complejidad de certificación PCI.

## Flujo completo

```
1. POST /api/turnos
   → crear turno en estado RESERVADO (expira en 15 min)
   → crear Preference en MP con external_reference = turnoId
   → devolver { turnoId, initPoint }

2. Frontend redirige a initPoint (MP)

3. Cliente paga en MP

4. MP llama al webhook: POST /api/webhooks/mp

5. Webhook handler:
   → verifica firma HMAC
   → consulta el pago en MP SDK
   → si aprobado: turno → SENIADO, pago.create, puntos++
   → notifica por WhatsApp
   → siempre responde 200 a MP
```

## Crear preference

```js
import { MercadoPagoConfig, Preference } from 'mercadopago';
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

const pref = await new Preference(client).create({
  body: {
    items: [{ title: servicio.nombre, unit_price: turno.montoSenia,
               quantity: 1, currency_id: 'ARS' }],
    payer: { name: cliente.nombre, surname: cliente.apellido },
    back_urls: {
      success: `${process.env.MP_BACK_URL}?turnoId=${turno.id}&status=success`,
      failure: `${process.env.MP_BACK_URL}?turnoId=${turno.id}&status=failure`,
      pending: `${process.env.MP_BACK_URL}?turnoId=${turno.id}&status=pending`,
    },
    auto_return: 'approved',
    external_reference: turno.id,
  }
});
return { preferenceId: pref.id, initPoint: pref.init_point };
```

## Verificación de firma del webhook

```js
// utils/hmac.js
function verifyMPSignature(req) {
  const sig = req.headers['x-signature'];        // 'ts=XXXX,v1=YYYY'
  const reqId = req.headers['x-request-id'];
  const dataId = req.query['data.id'];
  const ts = sig.match(/ts=(\d+)/)?.[1];
  const v1 = sig.match(/v1=([a-f0-9]+)/)?.[1];
  const manifest = `id:${dataId};request-id:${reqId};ts:${ts};`;
  const expected = crypto.createHmac('sha256', process.env.MP_WEBHOOK_SECRET)
    .update(manifest).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(v1), Buffer.from(expected));
}
```

## Webhook handler — reglas críticas

1. Verificar firma HMAC **antes** de cualquier otra cosa
2. Si `type !== 'payment'` → responder 200 sin procesar (MP manda distintos tipos)
3. Usar `prisma.$transaction` para actualizar turno + crear pago + sumar puntos
4. **SIEMPRE responder 200** — si se responde otro status, MP reintenta el webhook
5. Si Twilio falla al notificar → loguear warn, NO relanzar el error

## Variables de entorno requeridas

```
MP_ACCESS_TOKEN=        # token de producción de MercadoPago
MP_WEBHOOK_SECRET=      # secret configurado en el panel de MP → webhooks
MP_BACK_URL=            # https://tusnailslr.slotify.app/confirmacion
```
