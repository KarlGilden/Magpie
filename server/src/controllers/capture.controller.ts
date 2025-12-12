import { Request, Response } from 'express';
import { ProcessDocumentFunction } from '../types/documentai.types';
import { processText } from '../services/openai.service';
import { OpenAIConfig } from '../types/openai.types';
import { WordCaptureResponse } from '../types/app.types';

/**
 * Capture Controller
 * Handles the capture endpoint that pipes together DocumentAI and OpenAI services
 */
export class CaptureController {
  constructor(
    private processDocument: ProcessDocumentFunction,
    private openAIConfig: OpenAIConfig
  ) {}

  /**
   * POST /api/capture
   * Process an image through DocumentAI to extract text, then process that text with OpenAI
   */
  async capture(req: Request, res: Response): Promise<Response<WordCaptureResponse>> {
    console.log(req.file)
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No image file uploaded. Please provide an image file using field name "image".'
        });
      }

      const language = req.query['language'] as string;
      console.log(language)
      if (!language) {
        return res.status(400).json({
          success: false,
          error: 'Language parameter is required'
        });
      }

      console.log("Processing image with DocumentAI...");
      
      // Step 1: Process image with DocumentAI to extract text
      const documentResult = await this.processDocument(req.file);
      
      if (!documentResult.success || !documentResult.data?.text) {
        return res.status(400).json({
          success: false,
          error: documentResult.error || 'Failed to extract text from image',
          documentAI: documentResult
        });
      }

      const extractedText = documentResult.data.text;
      console.log("Extracted text:", extractedText);

      // Step 2: Process extracted text with OpenAI
      console.log("Processing text with OpenAI...");
      const openAIResult = await processText(extractedText, language, this.openAIConfig);

      if (!openAIResult) {
        return res.status(400).json({
          success: false,
          error: "Failed to generate response from OpenAI",
          documentAI: {
            success: true,
            extractedText: extractedText
          }
        });
      }

      // Return combined result
      return res.status(200).json(openAIResult);

    } catch (error) {
      console.error('Capture error:', error);
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error during capture processing'
      });
    }
  }
}


