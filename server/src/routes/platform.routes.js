import { Router } from 'express';
import prisma from '../config/prisma.js';
import platformController from '../controllers/platformController.js';
import verifyJWT, { requireSuperAdmin } from '../middleware/auth.js';

const router = Router();

// All platform routes require super admin
router.use(verifyJWT, requireSuperAdmin);

router.get('/stats', platformController.obtenerStats);
router.get('/metrics', platformController.obtenerMetricas);
router.get('/metrics/registros', platformController.registrosPorDia);

router.get('/tenants', platformController.listarTenants);
router.get('/tenants/:id', platformController.obtenerTenant);
router.post('/tenants', platformController.crearTenant);
router.patch('/tenants/:id', platformController.actualizarTenant);
router.patch('/tenants/:id/toggle', platformController.toggleTenantActivo);
router.delete('/tenants/:id', platformController.eliminarTenant);

router.get('/admins', platformController.listarAdmins);
router.post('/admins', platformController.crearAdmin);
router.patch('/admins/:id/reset-password', platformController.resetAdminPassword);
router.delete('/admins/:id', platformController.eliminarAdmin);

// Announcements CRUD
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { creadoEn: 'desc' },
      take: 50,
    });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener anuncios' });
  }
});

router.post('/announcements', async (req, res) => {
  try {
    const { titulo, mensaje, tipo, expiraEn } = req.body;
    if (!titulo || !mensaje) {
      return res.status(400).json({ error: 'Título y mensaje son requeridos' });
    }
    const announcement = await prisma.announcement.create({
      data: {
        titulo,
        mensaje,
        tipo: tipo || 'info',
        expiraEn: expiraEn ? new Date(expiraEn) : null,
      },
    });
    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear anuncio' });
  }
});

router.delete('/announcements/:id', async (req, res) => {
  try {
    await prisma.announcement.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar anuncio' });
  }
});

export default router;
