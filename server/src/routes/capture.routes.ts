import { Router } from 'express';
import { captureController } from '../controllers/capture.controller';
import { uploadSingle, handleUploadError } from '../middleware/upload.middleware';

const captureRouter = Router();

// POST /api/capture - Process image through DocumentAI and OpenAI pipeline
captureRouter.post('/', uploadSingle, handleUploadError, captureController.capture);

export default captureRouter;


