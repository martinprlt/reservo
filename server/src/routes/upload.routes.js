import { Router } from 'express';
import uploadController from '../controllers/uploadController.js';
import cloudinaryService from '../services/cloudinaryService.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import verifyJWT from '../middleware/auth.js';

const router = Router();

router.post('/', verifyJWT, uploadLimiter, cloudinaryService.uploadMiddleware, uploadController.uploadImage);
router.delete('/', verifyJWT, uploadLimiter, uploadController.deleteImage);

export default router;
