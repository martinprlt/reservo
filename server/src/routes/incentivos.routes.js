import { Router } from 'express';
import incentivosController from '../controllers/incentivosController.js';
import verifyJWT from '../middleware/auth.js';

const router = Router();

router.use(verifyJWT);
router.get('/', incentivosController.listar);
router.post('/', incentivosController.crear);
router.patch('/:id', incentivosController.actualizar);
router.delete('/:id', incentivosController.eliminar);

export default router;
