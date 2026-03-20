import pkg from 'twilio';
const { Twilio } = pkg;
import env from './env.js';

const client = new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

export async function enviarWhatsApp(to, mensaje) {
  try {
    await client.messages.create({
      from: env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${to}`,
      body: mensaje,
    });
    return true;
  } catch (error) {
    console.error('Error enviando WhatsApp:', error.message);
    return false;
  }
}

export default client;
