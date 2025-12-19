import { Request, Response } from 'express';
import { openAIService } from '../services/openai.service';

/**
 * POST /api/openai/chat
 * Process text and generate word/phrase translations
 */
const chat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, language } = req.body;
    
    if (!text) {
      res.status(400).json({
        success: false,
        error: 'No text supplied'
      });
      return;
    }

    const result = await openAIService.processText(text, language);

    if (!result) {
      res.status(400).json({
        success: false,
        error: "Failed to generate response"
      });
      return;
    }

    console.log(result);

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('OpenAI chat error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'OpenAI API error'
    });
  }
};

/**
 * GET /api/openai/status
 * Get OpenAI service status
 */
const status = async (_req: Request, res: Response): Promise<void> => {
  try {
    const statusResult = await openAIService.getStatus();
    res.json(statusResult);
  } catch (error) {
    console.error('OpenAI status check error:', error);
    res.status(500).json({
      status: 'error',
      error: 'Failed to check OpenAI service status'
    });
  }
};

export const openAIController = {
  chat,
  status
};

