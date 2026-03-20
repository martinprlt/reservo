import { Router } from 'express';
import webhookController from '../controllers/webhookController.js';

const router = Router();

router.post('/mp', webhookController.mp);

export default router;
