import { Router } from 'express';
import platformController from '../controllers/platformController.js';
import verifyJWT, { requireSuperAdmin } from '../middleware/auth.js';

const router = Router();

// All platform routes require super admin
router.use(verifyJWT, requireSuperAdmin);

router.get('/stats', platformController.obtenerStats);

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

export default router;
