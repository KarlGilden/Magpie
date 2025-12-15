import { Request, Response } from 'express';
import { processText, getStatus as getOpenAIStatus } from '../services/openai.service';
import { OpenAIConfig } from '../types/openai.types';

/**
 * OpenAI Controller
 * Handles all OpenAI-related endpoints
 */
export class OpenAIController {
  constructor(private config: OpenAIConfig) {}

  /**
   * POST /api/openai/chat
   * Process text and generate word/phrase translations
   */
  async chat(req: Request, res: Response): Promise<void> {
    try {
      const { text, language } = req.body;
      
      if (!text) {
        res.status(400).json({
          success: false,
          error: 'No text supplied'
        });
        return;
      }

      const result = await processText(text, language, this.config);

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
  }

  /**
   * GET /api/openai/status
   * Get OpenAI service status
   */
  async status(_req: Request, res: Response): Promise<void> {
    try {
      const status = await getOpenAIStatus(this.config);
      res.json(status);
    } catch (error) {
      console.error('OpenAI status check error:', error);
      res.status(500).json({
        status: 'error',
        error: 'Failed to check OpenAI service status'
      });
    }
  }
}

