import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createDocumentAIService } from './services/documentai.service';
import { DocumentAIConfig } from './types/documentai.types';
import { OpenAIConfig } from './types/openai.types';
import { OpenAIController } from './controllers/openai.controller';
import { DocumentAIController } from './controllers/documentai.controller';
import { createOpenAIRoutes } from './routes/openai.routes';
import { createDocumentAIRoutes } from './routes/documentai.routes';

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

// Initialize OpenAI service
const openAIConfig: OpenAIConfig = {
  apiKey: process.env['OPENAI_API_KEY'] || '',
  model: process.env['OPENAI_MODEL'] || 'gpt-3.5-turbo',
  organization: process.env['OPENAI_ORGANIZATION'] || ''
};

// Initialize controllers
const openAIController = new OpenAIController(openAIConfig);
const documentAIController = new DocumentAIController(documentAIService.processDocument);

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Base routes
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome to WordCapture API',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/openai', createOpenAIRoutes(openAIController));
app.use('/api/documentai', createDocumentAIRoutes(documentAIController));

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
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
