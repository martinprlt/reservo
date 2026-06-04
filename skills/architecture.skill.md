# Skill: Slotify — Arquitectura general

## Contexto

Slotify es un SaaS multi-tenant de gestión de turnos para emprendimientos de
servicios (belleza, salud, bienestar). Múltiples negocios (tenants) comparten
la misma base de datos, aislados por `tenantId`.

## Estructura de capas (backend)

```
Request → middleware (tenant → auth → validate) → route → controller → service → Prisma → DB
```

- **middleware**: resuelve tenant, verifica JWT, valida body con Zod, aplica rate limit
- **routes**: define los endpoints y encadena middlewares + controller
- **controllers**: reciben `(req, res, next)`, llaman al service, responden HTTP
- **services**: lógica de negocio pura, sin `req`/`res`, retornan datos o lanzan errores
- **schemas**: definiciones Zod compartidas entre front y back

## Estructura de carpetas — server/

```
server/
├── src/
│   ├── config/         env.js · prisma.js · twilio.js
│   ├── middleware/     tenant.js · auth.js · rateLimiter.js · validate.js · errorHandler.js
│   ├── routes/         index.js · auth · servicios · clientes · turnos · disponibilidad · webhooks
│   ├── controllers/    (mismo naming que routes)
│   ├── services/       auth · servicios · clientes · turnos · disponibilidad · pagos · notificaciones
│   ├── schemas/        auth · servicio · cliente · turno
│   ├── jobs/           liberarReservas.job.js
│   └── utils/          logger.js · jwt.js · hmac.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── app.js
└── index.js
```

## Estructura de carpetas — client/

```
client/src/
├── api/            client.js (axios singleton)
├── store/          bookingStore.js · adminStore.js (Zustand)
├── pages/
│   ├── booking/    BookingPage · Step1 · Step2 · Step3 · Step4 · Confirmacion
│   └── admin/      LoginPage · AgendaPage · ClientesPage · ServiciosPage
├── components/
│   ├── ui/         Button · Input · Modal · Badge
│   ├── booking/    ServicioCard · CalendarioDinamico · ResumenTurno
│   └── admin/      TurnoCard · AgendaSemanal · ClienteRow
├── hooks/          useServicios · useDisponibilidad · useAdmin
└── utils/          fechas.js · tema.js
```

## Convenciones de naming

- Archivos: `kebab-case.js` en back, `PascalCase.jsx` en front
- Funciones de service: verbos en español (`crearTurno`, `listarClientes`)
- Errores: strings en SCREAMING_SNAKE_CASE (`'SLOT_NO_DISPONIBLE'`)
- Variables de entorno: siempre en `config/env.js`, nunca acceder directo a `process.env` desde services

## Flujo de un error

```
service lanza Error('CODIGO_ERROR')
  → controller lo captura
  → mapea el código a un status HTTP
  → si no conoce el código → pasa a next(err) → errorHandler
```
