import 'dotenv/config';
import { cleanEnv, str, port, bool, num } from 'envalid';

const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
  PORT: port({ default: 4000 }),
  DATABASE_URL: str(),
  JWT_SECRET: str(),
  JWT_EXPIRES_IN: str({ default: '8h' }),
  MP_ACCESS_TOKEN: str(),
  MP_WEBHOOK_SECRET: str(),
  MP_BACK_URL: str(),
  TWILIO_ACCOUNT_SID: str(),
  TWILIO_AUTH_TOKEN: str(),
  TWILIO_WHATSAPP_FROM: str(),
  FRONTEND_URL: str({ default: 'http://localhost:3000' }),
});

export default env;
