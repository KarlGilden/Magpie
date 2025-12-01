import { Router } from 'express';
import { OpenAIController } from '../controllers/openai.controller';

/**
 * OpenAI Routes
 * Defines all routes for OpenAI-related endpoints
 */
export const createOpenAIRoutes = (controller: OpenAIController): Router => {
  const router = Router();

  // POST /api/openai/chat - Process text and generate word/phrase translations
  router.post('/chat', (req, res) => {
    controller.chat(req, res);
  });

  // GET /api/openai/status - Get OpenAI service status
  router.get('/status', (req, res) => {
    controller.status(req, res);
  });

  return router;
};

