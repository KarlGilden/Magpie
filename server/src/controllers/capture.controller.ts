import { Request, Response } from 'express';
import { ProcessDocumentFunction } from '../types/documentai.types';
import { processText } from '../services/openai.service';
import { OpenAIConfig } from '../types/openai.types';

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
  async capture(req: Request, res: Response): Promise<void> {
    console.log(req.file)
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: 'No image file uploaded. Please provide an image file using field name "image".'
        });
        return;
      }

      const language = req.query['language'] as string;
      console.log(language)
      if (!language) {
        res.status(400).json({
          success: false,
          error: 'Language parameter is required'
        });
        return;
      }

      console.log("Processing image with DocumentAI...");
      
      // Step 1: Process image with DocumentAI to extract text
      const documentResult = await this.processDocument(req.file);
      
      if (!documentResult.success || !documentResult.data?.text) {
        res.status(400).json({
          success: false,
          error: documentResult.error || 'Failed to extract text from image',
          documentAI: documentResult
        });
        return;
      }

      const extractedText = documentResult.data.text;
      console.log("Extracted text:", extractedText);

      // Step 2: Process extracted text with OpenAI
      console.log("Processing text with OpenAI...");
      const openAIResult = await processText(extractedText, language, this.openAIConfig);

      if (!openAIResult) {
        res.status(400).json({
          success: false,
          error: "Failed to generate response from OpenAI",
          documentAI: {
            success: true,
            extractedText: extractedText
          }
        });
        return;
      }

      // Return combined result
      res.json({
        success: true,
        data: openAIResult,
        metadata: {
          extractedText: extractedText,
          language: language,
          documentAI: documentResult.metadata,
          imageInfo: {
            originalName: req.file.originalname,
            size: req.file.size,
            mimeType: req.file.mimetype
          },
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Capture error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error during capture processing'
      });
    }
  }
}


