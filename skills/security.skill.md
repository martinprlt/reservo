# Skill: Slotify — Seguridad

## Vulnerabilidades conocidas y mitigaciones

### 1. Fuga de datos entre tenants (CRÍTICO)
- **Qué es**: query sin `tenantId` devuelve datos de todos los tenants
- **Mitigación**: `tenantId` obligatorio en TODO query. Ver `multitenant.skill.md`

### 2. JWT en localStorage (XSS)
- **Qué es**: el token puede ser robado con JavaScript malicioso
- **Mitigación**: siempre HttpOnly cookie. Ver `auth.skill.md`

### 3. Webhook MP falso
- **Qué es**: alguien envía un POST falso a `/api/webhooks/mp`
- **Mitigación**: verificar firma HMAC antes de procesar. Ver `mercadopago.skill.md`

### 4. IDOR — acceder a recurso de otro tenant
- **Qué es**: un admin de tenant A accede al turno de tenant B
- **Mitigación**: siempre verificar `recurso.tenantId === req.tenantId`
- **Código patrón**:
  ```js
  const item = await prisma.modelo.findUnique({ where: { id } });
  if (!item || item.tenantId !== tenantId) throw new Error('RECURSO_NO_ENCONTRADO');
  ```

### 5. Fuerza bruta al login
- **Qué es**: intentos masivos de adivinar contraseñas
- **Mitigación**: `loginLimiter` — 5 intentos por IP cada 15 min → 429

### 6. SQL injection
- **Qué es**: input malicioso en queries
- **Mitigación**: Prisma usa queries parametrizados automáticamente.
  Nunca concatenar strings en queries.

### 7. Datos sensibles en logs
- **Qué es**: tokens, passwords aparecen en logs y se exponen
- **Mitigación**: configurar Winston para nunca loguear:
  `password`, `passwordHash`, `token`, `secret`, `mpPaymentId`

### 8. Stack trace en producción
- **Qué es**: los errores revelan estructura interna del sistema
- **Mitigación**: `errorHandler.js` siempre devuelve mensaje genérico en producción

### 9. Env vars en el código
- **Qué es**: secrets hardcodeados en el repo
- **Mitigación**: toda variable en `.env` validada por `envalid` al arrancar.
  `.env` en `.gitignore`. Secretos en Railway env vars.

### 10. Spam de reservas
- **Qué es**: un bot crea cientos de turnos RESERVADO bloqueando la agenda
- **Mitigación**: `bookingLimiter` — 10 reservas por IP por hora.
  El job de cron libera los no señados en 15 minutos.

## Headers de seguridad

`helmet()` se aplica como primer middleware en `app.js`.
No modificar la configuración por defecto de helmet sin revisar este skill.

## CORS

Solo permitir el dominio propio del tenant:
```js
cors({ origin: (origin, cb) => {
  // validar que el origin termina en .slotify.app
  cb(null, true);
}, credentials: true })
```
