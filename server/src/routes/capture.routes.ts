import { Request, Response, Router } from 'express';
import { CaptureController } from '../controllers/capture.controller';
import { uploadSingle, handleUploadError } from '../middleware/upload.middleware';

/**
 * Capture Routes
 * Defines all routes for the capture endpoint that combines DocumentAI and OpenAI
 */
export const createCaptureRoutes = (controller: CaptureController): Router => {
  const router = Router();

  // POST /api/capture - Process image through DocumentAI and OpenAI pipeline
  router.post('/', uploadSingle, handleUploadError, (req: Request, res: Response) => {
    controller.capture(req, res);
  });

  return router;
};


