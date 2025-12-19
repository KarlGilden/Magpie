import { Router } from 'express';
import { documentAIController } from '../controllers/documentai.controller';
import { uploadSingle, handleUploadError } from '../middleware/upload.middleware';

const documentAIRouter = Router();

// POST /api/process-image - Process an image using Google Document AI
documentAIRouter.post('/process-image', uploadSingle, handleUploadError, documentAIController.processImage);

export default documentAIRouter;

