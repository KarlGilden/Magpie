import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import {
  DocumentAIConfig,
  DocumentAIResponse,
  ProcessDocumentRequest,
  ProcessDocumentResponse,
  ServiceStatus,
  ValidationResult,
  ProcessDocumentFunction,
  GetStatusFunction,
  ValidateConfigFunction
} from '../types/documentai.types';

// Global client instance
let client: DocumentProcessorServiceClient | null = null;

/**
 * Initialize the Document AI client
 */
const initializeClient = (config: DocumentAIConfig): DocumentProcessorServiceClient => {
  if (client) {
    return client;
  }

  // Set credentials if provided
  if (config.credentialsPath) {
    process.env['GOOGLE_APPLICATION_CREDENTIALS'] = config.credentialsPath;
  }

  client = new DocumentProcessorServiceClient();
  return client;
};

/**
 * Validate Document AI configuration
 */
export const validateConfig: ValidateConfigFunction = (config: DocumentAIConfig): ValidationResult => {
  const errors: string[] = [];

  if (!config.projectId) {
    errors.push('Project ID is required');
  }

  if (!config.location) {
    errors.push('Location is required');
  }

  if (!config.processorId) {
    errors.push('Processor ID is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate image file type and size
 */
const validateFile = (file: Express.Multer.File): void => {
  if (!file || !file.buffer) {
    throw new Error('No image file provided or file buffer is empty');
  }

  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/tiff',
    'image/bmp',
    'image/webp'
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error(`Unsupported image type: ${file.mimetype}. Supported image types: ${allowedMimeTypes.join(', ')}`);
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size && file.size > maxSize) {
    throw new Error(`Image file too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
  }
};

/**
 * Extract entities from Document AI response
 */
const extractEntities = (pages: any[]): any[] => {
  return pages.flatMap(page => 
    page.entities?.map((entity: any) => ({
      type: entity.type,
      value: entity.value,
      confidence: entity.confidence || 0,
      boundingBox: entity.boundingBox ? {
        x: entity.boundingBox.normalizedVertices?.[0]?.x || 0,
        y: entity.boundingBox.normalizedVertices?.[0]?.y || 0,
        width: (entity.boundingBox.normalizedVertices?.[2]?.x || 0) - (entity.boundingBox.normalizedVertices?.[0]?.x || 0),
        height: (entity.boundingBox.normalizedVertices?.[2]?.y || 0) - (entity.boundingBox.normalizedVertices?.[0]?.y || 0)
      } : undefined
    })) || []
  );
};

/**
 * Extract pages with their entities
 */
const extractPages = (pages: any[]): any[] => {
  return pages.map(page => ({
    pageNumber: page.pageNumber || 0,
    text: page.text || '',
    entities: page.entities?.map((entity: any) => ({
      type: entity.type,
      value: entity.value,
      confidence: entity.confidence || 0,
      boundingBox: entity.boundingBox ? {
        x: entity.boundingBox.normalizedVertices?.[0]?.x || 0,
        y: entity.boundingBox.normalizedVertices?.[0]?.y || 0,
        width: (entity.boundingBox.normalizedVertices?.[2]?.x || 0) - (entity.boundingBox.normalizedVertices?.[0]?.x || 0),
        height: (entity.boundingBox.normalizedVertices?.[2]?.y || 0) - (entity.boundingBox.normalizedVertices?.[0]?.y || 0)
      } : undefined
    })) || [],
    confidence: page.entities?.length ? 
      page.entities.reduce((sum: number, entity: any) => sum + (entity.confidence || 0), 0) / page.entities.length : 0
  }));
};

/**
 * Calculate average confidence score
 */
const calculateAverageConfidence = (entities: any[]): number => {
  return entities.length > 0 
    ? entities.reduce((sum, entity) => sum + entity.confidence, 0) / entities.length 
    : 0;
};

/**
 * Process an image using Google Document AI
 */
export const processDocument = (config: DocumentAIConfig): ProcessDocumentFunction => {
  return async (file: Express.Multer.File): Promise<DocumentAIResponse> => {
    const startTime = Date.now();
    
    try {
      // Validate image file
      validateFile(file);

      // Initialize client
      const documentClient = initializeClient(config);

      // Prepare the request
      const request: ProcessDocumentRequest = {
        name: `projects/${config.projectId}/locations/${config.location}/processors/${config.processorId}`,
        rawDocument: {
          content: file.buffer.toString('base64'),
          mimeType: file.mimetype
        }
      };
      console.log("LOG: ", request)
      // Process the image
      const [result] = await documentClient.processDocument(request);
      const response = result as ProcessDocumentResponse;

      // Extract text and entities
      const document = response.document;
      const text = document.text || '';
      
      // Extract entities (typically from the first page for images)
      const entities = extractEntities(document.pages || []);
      const pages = extractPages(document.pages || []);
      const confidence = calculateAverageConfidence(entities);

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        data: {
          text,
          entities,
          pages,
          confidence
        },
        metadata: {
          processorId: config.processorId,
          location: config.location,
          processingTime
        }
      };

    } catch (error) {
      console.error('Image processing error:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred during image processing',
        metadata: {
          processorId: config.processorId,
          location: config.location,
          processingTime: Date.now() - startTime
        }
      };
    }
  };
};

/**
 * Get service status
 */
export const getStatus = (config: DocumentAIConfig): GetStatusFunction => {
  return async (): Promise<ServiceStatus> => {
    try {
      const validation = validateConfig(config);
      
      return {
        status: validation.isValid ? 'ready' : 'configuration_error',
        config,
        errors: validation.errors
      };
    } catch (error) {
      console.error('Status check error:', error);
      return {
        status: 'error',
        config,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  };
};

/**
 * Create Document AI service functions
 */
export const createDocumentAIService = (config: DocumentAIConfig) => {
  return {
    processDocument: processDocument(config),
    getStatus: getStatus(config),
    validateConfig: () => validateConfig(config)
  };
};
