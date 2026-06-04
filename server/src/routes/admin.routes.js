import { Router } from 'express';
import adminController from '../controllers/adminController.js';
import exportController from '../controllers/exportController.js';
import reportesController from '../controllers/reportesController.js';
import notificacionesController from '../controllers/notificacionesController.js';
import verifyJWT from '../middleware/auth.js';
import { enviarWhatsApp } from '../config/twilio.js';
import prisma from '../config/prisma.js';

const router = Router();

router.use(verifyJWT);
router.get('/stats', adminController.obtenerStats);
router.get('/agenda', adminController.obtenerAgenda);
router.get('/turnos', adminController.listarTurnos);
router.post('/turnos', adminController.crearTurnoAdmin);
router.get('/turnos/:id', adminController.obtenerTurno);
router.patch('/turnos/:id', adminController.actualizarTurno);
router.delete('/turnos/:id', adminController.eliminarTurno);
router.delete('/turnos', adminController.eliminarTurnosMasivo);
router.get('/clientes', adminController.listarClientes);
router.get('/clientes/:id', adminController.obtenerCliente);
router.delete('/clientes/:id/turnos', adminController.eliminarTurnosCliente);
router.get('/servicios', adminController.listarServiciosAdmin);
router.post('/servicios', adminController.crearServicio);
router.patch('/servicios/:id', adminController.actualizarServicio);
router.delete('/servicios/:id', adminController.eliminarServicio);
router.post('/servicios/cleanup-duplicates', adminController.cleanupDuplicates);
router.get('/config', adminController.obtenerConfig);
router.patch('/config', adminController.actualizarConfig);
router.post('/add-admin', adminController.addAdmin);
router.get('/notificaciones', notificacionesController.listar);
router.get('/notificaciones/contar', notificacionesController.contar);
router.patch('/notificaciones/:id/leer', notificacionesController.marcarLeida);
router.post('/notificaciones/leer-todas', notificacionesController.marcarTodasLeidas);
router.get('/export/clientes', exportController.clientesCSV);
router.get('/export/turnos', exportController.turnosCSV);

// Reportes
router.get('/reportes/turnos', reportesController.reporteTurnos);
router.get('/reportes/ganancias', reportesController.reporteGanancias);
router.get('/reportes/trabajos', reportesController.reporteTrabajos);

// Test WhatsApp — POST /admin/test-whatsapp
router.post('/test-whatsapp', async (req, res) => {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: req.tenantId },
      select: { config: true, nombre: true },
    });
    const telefono = tenant?.config?.telefonoAdmin;
    if (!telefono) {
      return res.status(400).json({ error: 'No tenés telefonoAdmin configurado. Andá a Configuración y poné tu número.' });
    }
    const ok = await enviarWhatsApp(telefono, `✅ Test de Slotify\n\nSi ves este mensaje, las notificaciones WhatsApp están funcionando!\n\nNegocio: ${tenant.nombre}`);
    if (ok) {
      res.json({ ok: true, mensaje: `Mensaje enviado a +${telefono}. Checkeá tu WhatsApp.` });
    } else {
      res.status(500).json({ error: 'Twilio falló. Verificá las env vars TWILIO_* en Render.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
