import { Router } from 'express';
import serviciosController from '../controllers/serviciosController.js';

const router = Router();

router.get('/', serviciosController.listar);

export default router;
