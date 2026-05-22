import { Router } from 'express';
import authRoutes from './auth.routes.js';
import serviciosRoutes from './servicios.routes.js';
import disponibilidadRoutes from './disponibilidad.routes.js';
import clientesRoutes from './clientes.routes.js';
import turnosRoutes from './turnos.routes.js';
import adminRoutes from './admin.routes.js';
import incentivosRoutes from './incentivos.routes.js';
import webhooksRoutes from './webhooks.routes.js';
import uploadRoutes from './upload.routes.js';
import resolveTenant from '../middleware/tenant.js';
import prisma from '../config/prisma.js';

const router = Router();

router.use(resolveTenant);

// Public tenant config for booking
router.get('/config', async (req, res) => {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: req.tenantId },
      select: { config: true, nombre: true },
    });
    res.json({
      nombre: tenant?.config?.nombreNegocio || tenant?.nombre,
      logo: tenant?.config?.logoUrl || null,
      horarios: tenant?.config?.horarios || {},
      telefonoAdmin: tenant?.config?.telefonoAdmin || '',
      mpLink: tenant?.config?.mpLink || '',
      billeteraVirtual: tenant?.config?.billeteraVirtual || '',
      incentivosActivos: tenant?.config?.incentivosActivos !== false,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error' });
  }
});

router.use('/auth', authRoutes);
router.use('/servicios', serviciosRoutes);
router.use('/disponibilidad', disponibilidadRoutes);
router.use('/clientes', clientesRoutes);
router.use('/turnos', turnosRoutes);
router.use('/admin', adminRoutes);
router.use('/incentivos', incentivosRoutes);
router.use('/webhooks', webhooksRoutes);
router.use('/upload', uploadRoutes);

export default router;
