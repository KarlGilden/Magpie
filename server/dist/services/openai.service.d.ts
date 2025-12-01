import { OpenAIConfig, ProcessTextFunction, GetStatusFunction, ValidateConfigFunction } from '../types/openai.types';
export declare const validateConfig: ValidateConfigFunction;
export declare const getStatus: GetStatusFunction;
export declare const processText: ProcessTextFunction;
export declare const generateCompletion: (prompt: string, config: OpenAIConfig, options?: {
    maxTokens?: number;
    temperature?: number;
    model?: string;
}) => Promise<string>;
export declare const analyzeText: (text: string, config: OpenAIConfig, analysisType?: "summarize" | "extract" | "classify" | "translate", targetLanguage?: string) => Promise<string>;
//# sourceMappingURL=openai.service.d.ts.map