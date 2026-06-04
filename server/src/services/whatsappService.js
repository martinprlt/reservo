import { enviarWhatsApp } from '../config/twilio.js';
import logger from '../utils/logger.js';

function formatFecha(fechaHora) {
  return new Date(fechaHora).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export async function enviarConfirmacionTurno(turno) {
  const { cliente, servicio, fechaHora, tenant, montoSenia } = turno;
  const config = tenant?.config || {};
  const telefonoAdmin = config.telefonoAdmin;

  const fechaFormateada = formatFecha(fechaHora);

  const mensajeCliente = `¡Tu turno fue confirmado!\n\n` +
    `Servicio: ${servicio.nombre}\n` +
    `Fecha: ${fechaFormateada}\n\n` +
    `Te esperamos.`;

  await enviarWhatsApp(cliente.telefono, mensajeCliente);

  if (telefonoAdmin) {
    const mensajeAdmin = `💰 Nueva seña recibida\n\n` +
      `Cliente: ${cliente.nombre} ${cliente.apellido}\n` +
      `Servicio: ${servicio.nombre}\n` +
      `Fecha: ${fechaFormateada}\n` +
      `Monto: $${montoSenia?.toLocaleString('es-AR')}`;

    await enviarWhatsApp(telefonoAdmin, mensajeAdmin);
  }
}

export async function enviarRecordatorio(turno) {
  const { cliente, servicio, fechaHora } = turno;

  const fechaFormateada = formatFecha(fechaHora);

  const mensaje = `Recordatorio: tenés turno mañana\n\n` +
    `Servicio: ${servicio.nombre}\n` +
    `Fecha: ${fechaFormateada}\n\n` +
    `¡Te esperamos!`;

  await enviarWhatsApp(cliente.telefono, mensaje);
}

export async function enviarNuevoTurnoAdmin(tenant, turno) {
  const config = tenant?.config || {};
  const telefonoAdmin = config.telefonoAdmin;
  if (!telefonoAdmin) return;

  const { cliente, servicio, fechaHora } = turno;
  const fechaFormateada = formatFecha(fechaHora);

  const mensaje = `📅 Nuevo turno reservado\n\n` +
    `Cliente: ${cliente.nombre} ${cliente.apellido}\n` +
    `Tel: ${cliente.telefono}\n` +
    `Servicio: ${servicio.nombre}\n` +
    `Fecha: ${fechaFormateada}\n\n` +
    `Ingresá al panel para ver los detalles.`;

  const ok = await enviarWhatsApp(telefonoAdmin, mensaje);
  if (!ok) logger.warn(`No se pudo enviar WhatsApp de nuevo turno al admin del tenant ${tenant.id}`);
}

export async function enviarConfirmacionCliente(turno) {
  const { cliente, servicio, fechaHora } = turno;
  const fechaFormateada = formatFecha(fechaHora);

  const mensaje = `✅ Tu turno fue confirmado\n\n` +
    `Servicio: ${servicio.nombre}\n` +
    `Fecha: ${fechaFormateada}\n\n` +
    `¡Te esperamos!`;

  const ok = await enviarWhatsApp(cliente.telefono, mensaje);
  if (!ok) logger.warn(`No se pudo enviar WhatsApp de confirmación al cliente ${cliente.id}`);
}

export async function enviarCancelacionCliente(turno, motivo) {
  const { cliente, servicio, fechaHora } = turno;
  const fechaFormateada = formatFecha(fechaHora);

  const mensaje = `❌ Tu turno fue cancelado\n\n` +
    `Servicio: ${servicio.nombre}\n` +
    `Fecha: ${fechaFormateada}` +
    (motivo ? `\nMotivo: ${motivo}` : '') +
    `\n\nSi tenés dudas, contactanos.`;

  const ok = await enviarWhatsApp(cliente.telefono, mensaje);
  if (!ok) logger.warn(`No se pudo enviar WhatsApp de cancelación al cliente ${cliente.id}`);
}
