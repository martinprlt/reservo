import 'dotenv/config';
import { cleanEnv, str, port, makeExactValidator } from 'envalid';

const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'production', 'test'], default: 'development' }),
  PORT: port({ default: 4000 }),
  DATABASE_URL: str(),
  JWT_SECRET: str(),
  JWT_EXPIRES_IN: str({ default: '8h' }),
  
  // MercadoPago (optional - each admin can put their own)
  MP_ACCESS_TOKEN: str({ default: '' }),
  MP_WEBHOOK_SECRET: str({ default: '' }),
  MP_BACK_URL: str({ default: 'http://localhost:3000/booking/confirmacion' }),
  
  // Twilio (optional for development)
  TWILIO_ACCOUNT_SID: str({ default: '' }),
  TWILIO_AUTH_TOKEN: str({ default: '' }),
  TWILIO_WHATSAPP_FROM: str({ default: '' }),
  
  // App
  FRONTEND_URL: str({ default: 'http://localhost:3000' }),
});

export default env;
