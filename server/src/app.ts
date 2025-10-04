import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createDocumentAIService } from './services/documentai.service';
import { uploadSingle, handleUploadError } from './middleware/upload.middleware';
import { DocumentAIConfig } from './types/documentai.types';

// Load environment variables
dotenv.config();

const app = express();
const PORT: number = parseInt(process.env['PORT'] || '3000', 10);

// Initialize Document AI service
const documentAIConfig: DocumentAIConfig = {
  projectId: process.env['GOOGLE_CLOUD_PROJECT_ID'] || '',
  location: process.env['GOOGLE_CLOUD_LOCATION'] || 'us',
  processorId: process.env['GOOGLE_CLOUD_PROCESSOR_ID'] || '',
  credentialsPath: process.env['GOOGLE_APPLICATION_CREDENTIALS'] || ''
};

const documentAIService = createDocumentAIService(documentAIConfig);

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to WordCapture API',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Image processing endpoint
app.post('/api/process-image', uploadSingle, handleUploadError, async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file uploaded. Please provide an image file using field name "image".'
      });
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
});

app.get('/api/documentai/status', async (req: Request, res: Response) => {
  try {
    const status = await documentAIService.getStatus();
    res.json(status);
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      status: 'error',
      error: 'Failed to check Document AI service status'
    });
  }
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env['NODE_ENV'] === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});

export default app;
