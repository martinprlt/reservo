# AGENTS.md — Slotify

## Instrucción obligatoria

Antes de escribir cualquier código, leer TODOS los archivos en `/skills/`.
Respetar todas las reglas definidas ahí sin excepción.
Si una tarea entra en conflicto con un skill, preguntar antes de proceder.

## Orden de lectura

1. `skills/architecture.skill.md` — visión general, siempre leer primero
2. `skills/multitenant.skill.md` — regla más crítica del sistema
3. `skills/auth.skill.md` — autenticación y autorización
4. `skills/turnero.skill.md` — lógica del calendario dinámico
5. `skills/mercadopago.skill.md` — integración de pagos
6. `skills/security.skill.md` — vulnerabilidades conocidas
7. `skills/frontend.skill.md` — convenciones del cliente React

## Stack

- Backend: Node.js + Express + Prisma + PostgreSQL
- Frontend: React + Vite + Tailwind + Zustand
- Pagos: MercadoPago Checkout Pro
- Notificaciones: Twilio WhatsApp
- Deploy: Railway (monorepo)

## Reglas generales

- Nunca hardcodear secrets ni API keys — siempre `process.env.X`
- Nunca exponer stack traces en `NODE_ENV === 'production'`
- Todo error conocido tiene un código string (ej: `'SLOT_NO_DISPONIBLE'`)
- Los controllers solo reciben req/res y llaman al service — nunca lógica de negocio en controllers
- Los services son funciones puras — nunca importan req/res
- Schemas Zod se definen en `src/schemas/` y se reusan en front y back
