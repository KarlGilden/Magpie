import { Router } from 'express';
import { openAIController } from '../controllers/openai.controller';

const openAIRouter = Router();

// POST /api/openai/chat - Process text and generate word/phrase translations
openAIRouter.post('/chat', openAIController.chat);

// GET /api/openai/status - Get OpenAI service status
openAIRouter.get('/status', openAIController.status);

export default openAIRouter;

