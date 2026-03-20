import { Router } from 'express';
import clientesController from '../../controllers/clientesController.js';

const router = Router();

router.post('/identificar', clientesController.identificar);

export default router;
