# Reservo - Sistema SaaS de Gestión de Turnos

Plataforma multi-tenant para reservas de servicios con calendario dinámico, MercadoPago y WhatsApp.

## Tech Stack

- **Backend:** Node.js + Express + Prisma + PostgreSQL
- **Frontend:** React + Vite + Tailwind + Zustand + React Router
- **Pagos:** MercadoPago Checkout Pro
- **Notificaciones:** Twilio WhatsApp

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm o yarn

### Setup

```bash
# 1. Instalar dependencias
cd server && npm install
cd ../client && npm install

# 2. Configurar base de datos
# Crear DB en PostgreSQL:
# CREATE DATABASE reservo;

# 3. Configurar variables de entorno
cp server/.env.example server/.env
# Editar server/.env con tus credenciales

# 4. Crear schema y seed
cd server
npm run db:push
npm run db:seed

# 5. Arrancar
npm run dev          # server en :4000
cd ../client
npm run dev          # client en :3000
```

### Datos de prueba

- **Admin:** admin@tusnailslr.com / admin123
- **Tenant:** tusnailslr

## Estructura

```
reservo/
├── server/           # API Node.js + Express
│   ├── src/
│   │   ├── config/     # env, prisma, twilio
│   │   ├── middleware/  # tenant, auth, rateLimiter
│   │   ├── routes/      # auth, servicios, turnos, admin
│   │   ├── controllers/  # req/res handlers
│   │   ├── services/     # lógica de negocio
│   │   └── schemas/      # validación Zod
│   └── prisma/
│       └── schema.prisma  # modelo de datos
├── client/           # React PWA
│   └── src/
│       ├── pages/
│       │   ├── booking/   # wizard 4 pasos
│       │   └── admin/     # panel admin
│       ├── components/   # ui, booking, admin
│       ├── store/        # Zustand
│       └── hooks/         # useServicios, etc.
└── skills/           # guías para agentes
```

## API Endpoints

### Público
- `GET /api/servicios` - Lista servicios
- `GET /api/disponibilidad?servicioId&fecha` - Slots disponibles
- `POST /api/turnos` - Crear turno
- `POST /api/webhooks/mp` - Webhook MercadoPago

### Admin (JWT)
- `POST /api/auth/login` - Login
- `GET /api/admin/agenda` - Turnos de la semana
- `PATCH /api/admin/turnos/:id` - Actualizar turno
- `GET /api/admin/clientes` - Lista clientes
- `GET/PATCH /api/admin/config` - Config del tenant

## Variables de Entorno

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_EXPIRES_IN=8h
MP_ACCESS_TOKEN=...
MP_WEBHOOK_SECRET=...
MP_BACK_URL=http://localhost:3000/confirmacion
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+...
```

## Deploy

El proyecto está preparado para Railway con PostgreSQL nativo.

1. Conectar repo a Railway
2. Agregar variables de entorno
3. Deploy automático en push a main

## Licencia

MIT
