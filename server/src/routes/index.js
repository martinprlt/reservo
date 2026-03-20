import { Router } from 'express';
import authRoutes from './auth.routes.js';
import serviciosRoutes from './servicios.routes.js';
import disponibilidadRoutes from './disponibilidad.routes.js';
import clientesRoutes from './clientes.routes.js';
import turnosRoutes from './turnos.routes.js';
import adminRoutes from './admin.routes.js';
import webhooksRoutes from './webhooks.routes.js';
import resolveTenant from '../middleware/tenant.js';

const router = Router();

router.use('/auth', authRoutes);
router.use(resolveTenant);
router.use('/servicios', serviciosRoutes);
router.use('/disponibilidad', disponibilidadRoutes);
router.use('/clientes', clientesRoutes);
router.use('/turnos', turnosRoutes);
router.use('/admin', adminRoutes);
router.use('/webhooks', webhooksRoutes);

export default router;
