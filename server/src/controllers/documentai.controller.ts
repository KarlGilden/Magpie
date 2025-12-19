import { Request, Response } from 'express';
import { documentAIService } from '../services/documentai.service';

/**
 * POST /api/process-image
 * Process an image using Google Document AI
 */
const processImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'No image file uploaded. Please provide an image file using field name "image".'
      });
      return;
    }

    console.log("processing image");
    const result = await documentAIService.processDocument(req.file);
    
    if (result.success) {
      console.log(result.data?.text);
      res.json({
        ...result,
        imageInfo: {
          originalName: req.file.originalname,
          size: req.file.size,
          mimeType: req.file.mimetype
        }
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Image processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during image processing'
    });
  }
};

export const documentAIController = {
  processImage
};

