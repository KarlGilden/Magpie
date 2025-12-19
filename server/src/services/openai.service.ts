import OpenAI from 'openai';
import {
  OpenAIConfig,
  ServiceStatus,
  ValidationResult
} from '../types/openai.types';
import { WordCaptureResponse } from '../types/app.types';

// Global client instance
let client: OpenAI | null = null;

// Config stored at module level
let config: OpenAIConfig | null = null;

/**
 * Initialize the OpenAI client
 */
const initializeClient = (): OpenAI => {
  if (client) {
    return client;
  }

  if (!config) {
    throw new Error('OpenAI service not initialized. Call initialize() first.');
  }

  if (!config.apiKey) {
    throw new Error('OpenAI API key is required');
  }

  client = new OpenAI({
    apiKey: config.apiKey,
  });

  return client;
};

/**
 * Initialize OpenAI service with configuration
 */
const initialize = (openAIConfig: OpenAIConfig): void => {
  config = openAIConfig;
};

/**
 * Validate OpenAI configuration
 */
const validateConfig = (openAIConfig: OpenAIConfig): ValidationResult => {
  const errors: string[] = [];

  if (!openAIConfig.apiKey) {
    errors.push('API key is required');
  }

  if (!openAIConfig.model) {
    errors.push('Model is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get service status
 */
const getStatus = async (): Promise<ServiceStatus> => {
  if (!config) {
    return {
      status: 'error',
      message: 'OpenAI service not initialized',
      timestamp: new Date().toISOString()
    };
  }

  try {
    const validation = validateConfig(config);
    if (!validation.isValid) {
      return {
        status: 'error',
        message: `Configuration validation failed: ${validation.errors.join(', ')}`,
        timestamp: new Date().toISOString()
      };
    }

    // Test the connection by making a simple request
    const openai = initializeClient();
    await openai.models.list();

    return {
      status: 'healthy',
      message: 'OpenAI service is operational',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'error',
      message: `OpenAI service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Process text using OpenAI Chat Completions API
 */
const processText = async (
  text: string,
  language: string
): Promise<WordCaptureResponse | undefined> => {
  if (!config) {
    throw new Error('OpenAI service not initialized. Call initialize() first.');
  }

  try {

    // Initialize client
    const openai = initializeClient();

    const schema = {
      type: "object",
      properties: {
        words: {
          type: "array",
          items: {
            type: "object",
            properties: {
              text: { type: "string" },
              translation: { type: "array", items: { type: "string" } }
            },
            required: ["text", "translation"]
          }
        },
        phrases: {
          type: "array",
          items: {
            type: "object",
            properties: {
              text: { type: "string" },
              translation: { type: "array", items: { type: "string" } }
            },
            required: ["text", "translation"]
          }
        }
      },
      required: ["words", "phrases"]
    };

    const prompt = `
        You are a linguist. Analyze the following ${language} text:
        "${text}"
        Split it into useful phrases and words for a learner.
        Return:
        - A list of unique single words that appear in the text.
        - A list of useful multi-word phrases that are meaningful for learners. Include full sentences as well as shorter phrases if they are meaningful.
        - For each word or phrase, return a translation into English.
        - Avoid duplicates.
        - Do not include names, places, or numbers unless they are linguistically relevant.

        Only use information from the input text.  
        Translate accurately and concisely.
        Return the response in JSON format.
      `;

    const completion = await openai.chat.completions.create({
        model: "gpt-4.1-2025-04-14",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        response_format: { 
          type: "json_schema", 
          json_schema: {
            name: "WordCaptureResponse",
            schema
          } 
        },
    });

    if(!completion.choices) return;
    console.log(completion.choices[0]?.message.content);
    
    const response: WordCaptureResponse = JSON.parse(completion.choices[0]?.message.content ?? "{}");
    return response;

  } catch (error) {
    throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const openAIService = {
  initialize,
  processText,
  getStatus,
  validateConfig: () => config ? validateConfig(config) : { isValid: false, errors: ['Service not initialized'] }
};

/**
 * Generate a completion for a single prompt
 */
// export const generateCompletion = async (
//   prompt: string,
//   config: OpenAIConfig,
//   options?: {
//     maxTokens?: number;
//     temperature?: number;
//     model?: string;
//   }
// ): Promise<string> => {
//   const request: ChatCompletionRequest = {
//     messages: [
//       {
//         role: 'user',
//         content: prompt
//       }
//     ],
//     maxTokens: options?.maxTokens || 1000,
//     temperature: options?.temperature || 0.7,
//     model: options?.model || config.model || 'gpt-3.5-turbo'
//   };

//   const response = await processText(request, config);
  
//   if (response.choices.length === 0) {
//     throw new Error('No response generated');
//   }

//   return response.choices[0]?.message.content || '';
// };

/**
 * Analyze text content (useful for processing OCR results)
 */
// export const analyzeText = async (
//   text: string,
//   config: OpenAIConfig,
//   analysisType: 'summarize' | 'extract' | 'classify' | 'translate' = 'summarize',
//   targetLanguage?: string
// ): Promise<string> => {
//   let prompt = '';

//   switch (analysisType) {
//     case 'summarize':
//       prompt = `Please provide a concise summary of the following text:\n\n${text}`;
//       break;
//     case 'extract':
//       prompt = `Please extract the key information from the following text:\n\n${text}`;
//       break;
//     case 'classify':
//       prompt = `Please classify the following text and explain what type of document or content it is:\n\n${text}`;
//       break;
//     case 'translate':
//       const language = targetLanguage || 'English';
//       prompt = `Please translate the following text to ${language}:\n\n${text}`;
//       break;
//     default:
//       prompt = `Please analyze the following text:\n\n${text}`;
//   }

//   return await generateCompletion(prompt, config);
// };
