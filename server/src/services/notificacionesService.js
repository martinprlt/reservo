import { enviarWhatsApp } from '../config/twilio.js';

export async function enviarConfirmacionTurno(turno) {
  const { cliente, servicio, fechaHora, tenant } = turno;
  const config = tenant.config || {};
  const telefonoAdmin = config.telefonoAdmin;

  const fechaFormateada = new Date(fechaHora).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

  const mensajeCliente = `¡Tu turno fue confirmado! 📅\n\n` +
    `Servicio: ${servicio.nombre}\n` +
    `Fecha: ${fechaFormateada}\n\n` +
    `Te esperamos. ¡Nos vemos pronto!`;

  await enviarWhatsApp(cliente.telefono, mensajeCliente);

  if (telefonoAdmin) {
    const mensajeAdmin = `💰 ¡Nueva seña recibida!\n\n` +
      `Cliente: ${cliente.nombre} ${cliente.apellido}\n` +
      `Servicio: ${servicio.nombre}\n` +
      `Fecha: ${fechaFormateada}\n` +
      `Monto: $${turno.montoSenia}`;

    await enviarWhatsApp(telefonoAdmin, mensajeAdmin);
  }
}

export async function enviarRecordatorio(turno) {
  const { cliente, servicio, fechaHora } = turno;

  const fechaFormateada = new Date(fechaHora).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

  const mensaje = `📅 Recordatorio: tenés turno mañana\n\n` +
    `Servicio: ${servicio.nombre}\n` +
    `Hora: ${fechaFormateada}\n\n` +
    `¡Te esperamos!`;

  await enviarWhatsApp(cliente.telefono, mensaje);
}
