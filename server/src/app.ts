import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { store } from './data/db';
import { documentAIService } from './services/documentai.service';
import { openAIService } from './services/openai.service';
import { DocumentAIConfig } from './types/documentai.types';
import { OpenAIConfig } from './types/openai.types';
import authRouter from './routes/auth.routes';
import { errorHandler } from './middleware/error.middleware';
import openAIRouter from './routes/openai.routes';
import documentAIRouter from './routes/documentai.routes';
import captureRouter from './routes/capture.routes';

// Load environment variables
dotenv.config();

const app = express();

// Initialize Document AI service
const documentAIConfig: DocumentAIConfig = {
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  location: process.env.GOOGLE_CLOUD_LOCATION,
  processorId: process.env.GOOGLE_CLOUD_PROCESSOR_ID,
  credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS
};

documentAIService.initialize(documentAIConfig);

// Initialize OpenAI service
const openAIConfig: OpenAIConfig = {
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_MODEL,
  organization: process.env.OPENAI_ORGANIZATION
};

openAIService.initialize(openAIConfig);

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,    
})); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    cookie: {
      httpOnly: true,
      secure: false, //process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 60 * 24, // 24 hr
    },
    store,
    resave: false,
    saveUninitialized: false,
  }),
);

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
app.use('/api/auth', authRouter);
app.use('/api/openai', openAIRouter);
app.use('/api/documentai', documentAIRouter);
app.use('/api/capture', captureRouter);

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Error handler
app.use(errorHandler);

export default app;
