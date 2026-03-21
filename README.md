# Reservo

Sistema SaaS multi-tenant de turnos para emprendimientos.

## Deploy en Railway

1. Conectar repo a Railway
2. Crear PostgreSQL plugin
3. Agregar variables de entorno:

```
DATABASE_URL=<desde Railway PostgreSQL>
JWT_SECRET=<random 64 chars>
TWILIO_ACCOUNT_SID=<tu SID>
TWILIO_AUTH_TOKEN=<tu token>
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

4. Deploy automático

## Desarrollo Local

```bash
# Backend
cd server
npm install
npm run db:push
npm run db:seed
npm run dev  # http://localhost:4000

# Frontend (otra terminal)
cd client
npm install
npm run dev  # http://localhost:3000
```

## Login

- Email: admin@tusnailslr.com
- Password: admin123

## Features

- Booking flow de 5 pasos
- Panel admin completo
- Sistema de puntos
- WhatsApp automático
- Tema claro/oscuro
- PWA instalable
- MercadoPago por tenant
- i18n ES/EN
