import { Router } from 'express';
import uploadController from '../controllers/uploadController.js';
import cloudinaryService from '../services/cloudinaryService.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', uploadLimiter, cloudinaryService.uploadMiddleware, uploadController.uploadImage);
router.delete('/', uploadLimiter, uploadController.deleteImage);

export default router;
