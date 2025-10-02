// Document AI Types and Interfaces

export interface DocumentAIRequest {
  file: Express.Multer.File;
  processorId?: string;
  location?: string;
}

export interface DocumentAIResponse {
  success: boolean;
  data?: {
    text: string;
    entities?: DocumentEntity[];
    pages?: DocumentPage[];
    confidence?: number;
  };
  error?: string;
  metadata?: {
    processorId: string;
    location: string;
    processingTime: number;
  };
}

export interface DocumentEntity {
  type: string;
  value: string;
  confidence: number;
  boundingBox?: BoundingBox;
}

export interface DocumentPage {
  pageNumber: number;
  text: string;
  entities: DocumentEntity[];
  confidence: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DocumentAIConfig {
  projectId: string;
  location: string;
  processorId: string;
  credentialsPath?: string;
}

export interface ProcessDocumentRequest {
  name: string;
  rawDocument: {
    content: string;
    mimeType: string;
  };
}

export interface ProcessDocumentResponse {
  document: {
    text: string;
    pages: Array<{
      pageNumber: number;
      text: string;
      entities: Array<{
        type: string;
        value: string;
        confidence: number;
        boundingBox?: {
          normalizedVertices: Array<{
            x: number;
            y: number;
          }>;
        };
      }>;
    }>;
  };
  humanReviewStatus?: {
    state: string;
    stateMessage: string;
  };
}

export interface ServiceStatus {
  status: 'ready' | 'configuration_error' | 'error';
  config: DocumentAIConfig;
  errors?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export type ProcessDocumentFunction = (file: Express.Multer.File) => Promise<DocumentAIResponse>;
export type GetStatusFunction = () => Promise<ServiceStatus>;
export type ValidateConfigFunction = (config: DocumentAIConfig) => ValidationResult;

// File upload types
export interface FileUploadOptions {
  maxSize?: number;
  allowedMimeTypes?: string[];
  fieldName?: string;
}
