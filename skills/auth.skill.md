# Skill: Reservo — Autenticación y autorización

## Token de sesión

El JWT del admin se almacena en una **HttpOnly cookie**, nunca en
`localStorage`. Esto previene XSS.

```js
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 8 * 60 * 60 * 1000 // 8 horas
});
```

## Verificación del JWT

```js
// middleware/auth.js
function verifyJWT(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'No autorizado' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.adminId;
    req.tenantId = decoded.tenantId;
    next();
  } catch {
    return res.status(401).json({ error: 'Sesión expirada' });
  }
}
```

## Payload del JWT

```js
jwt.sign(
  { adminId: admin.id, tenantId: admin.tenantId },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN } // '8h'
)
```

## Rutas públicas vs protegidas

| Tipo | Middlewares | Ejemplos |
|------|-------------|---------|
| Pública | `resolveTenant, apiLimiter` | GET /servicios, POST /turnos |
| Booking | `resolveTenant, bookingLimiter, validate` | POST /clientes/identificar |
| Admin | `resolveTenant, verifyJWT` | GET /admin/agenda |
| Webhook | *(ninguno — HMAC propio)* | POST /webhooks/mp |

La ruta `/api/auth/*` NO lleva `resolveTenant` porque el tenant
ya viene dentro del JWT.

## Login seguro

```js
// CORRECTO — mismo error para usuario inexistente y password incorrecto
const admin = await prisma.admin.findUnique({ where: { tenantId_email: { tenantId, email } } });
if (!admin) throw new Error('CREDENCIALES_INVALIDAS');
const ok = await bcrypt.compare(password, admin.passwordHash);
if (!ok) throw new Error('CREDENCIALES_INVALIDAS');
// Nunca revelar cuál de los dos falló
```

## Hash de contraseñas

```js
// Al crear el admin:
const passwordHash = await bcrypt.hash(password, 12); // salt rounds: 12
```

## Rate limiting del login

`loginLimiter`: 5 intentos por IP cada 15 minutos.
Después del 5to intento: 429 con mensaje claro al usuario.
