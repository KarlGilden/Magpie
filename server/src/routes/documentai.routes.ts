import { Request, Response, Router } from 'express';
import { DocumentAIController } from '../controllers/documentai.controller';
import { uploadSingle, handleUploadError } from '../middleware/upload.middleware';

/**
 * DocumentAI Routes
 * Defines all routes for DocumentAI-related endpoints
 */
export const createDocumentAIRoutes = (controller: DocumentAIController): Router => {
  const router = Router();

  // POST /api/process-image - Process an image using Google Document AI
  router.post('/process-image', uploadSingle, handleUploadError, (req: Request, res: Response) => {
    controller.processImage(req, res);
  });

  return router;
};

