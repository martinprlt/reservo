import { Router } from 'express';
import disponibilidadController from '../controllers/disponibilidadController.js';

const router = Router();

router.get('/', disponibilidadController.obtenerSlots);

export default router;
