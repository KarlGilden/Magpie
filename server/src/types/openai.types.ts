/**
 * OpenAI Service Types
 */

import { WordCaptureResponse } from "./app.types";

export interface OpenAIConfig {
  apiKey: string;
  model?: string;
  organization?: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stream?: boolean;
  model?: string;
}

export interface ChatCompletionChoice {
  index: number;
  message: {
    role: string;
    content: string;
  };
  finishReason: string;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
  usage: TokenUsage;
}

export interface OpenAIResponse {
  success: boolean;
  data?: ChatCompletionResponse;
  error?: string;
  timestamp: string;
}

export interface ServiceStatus {
  status: 'healthy' | 'error' | 'unavailable';
  message: string;
  timestamp: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Function type definitions
export type ProcessTextFunction = (
  text: string,
  language: string,
  config: OpenAIConfig
) => Promise<WordCaptureResponse | undefined>;

export type GetStatusFunction = (
  config: OpenAIConfig
) => Promise<ServiceStatus>;

export type ValidateConfigFunction = (
  config: OpenAIConfig
) => ValidationResult;
