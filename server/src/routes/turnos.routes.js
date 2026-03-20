import { Router } from 'express';
import turnosController from '../controllers/turnosController.js';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { bookingLimiter } from '../middleware/rateLimiter.js';

const crearTurnoSchema = z.object({
  servicioId: z.string().min(1),
  varianteId: z.string().optional(),
  fechaHora: z.string().datetime(),
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  telefono: z.string().min(8),
});

const router = Router();

router.post('/', bookingLimiter, validate(crearTurnoSchema), turnosController.crear);
router.get('/:id/estado', turnosController.obtenerEstado);

export default router;
