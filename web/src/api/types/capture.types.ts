export interface WordPhrase {
  text: string;
  translations: string[];
}

export interface WordCaptureResponse {
  words: WordPhrase[];
  phrases: WordPhrase[];
}

export interface CaptureResponse {
  success: boolean;
  data: WordCaptureResponse;
  metadata: {
    extractedText: string;
    language: string;
    documentAI?: unknown;
    imageInfo: {
      originalName: string;
      size: number;
      mimeType: string;
    };
    timestamp: string;
  };
}

