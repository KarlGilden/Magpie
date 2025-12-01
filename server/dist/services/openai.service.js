"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeText = exports.generateCompletion = exports.processText = exports.getStatus = exports.validateConfig = void 0;
const openai_1 = __importDefault(require("openai"));
let client = null;
const initializeClient = (config) => {
    if (client) {
        return client;
    }
    if (!config.apiKey) {
        throw new Error('OpenAI API key is required');
    }
    client = new openai_1.default({
        apiKey: config.apiKey,
    });
    return client;
};
const validateConfig = (config) => {
    const errors = [];
    if (!config.apiKey) {
        errors.push('API key is required');
    }
    if (!config.model) {
        errors.push('Model is required');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
exports.validateConfig = validateConfig;
const getStatus = async (config) => {
    try {
        const validation = (0, exports.validateConfig)(config);
        if (!validation.isValid) {
            return {
                status: 'error',
                message: `Configuration validation failed: ${validation.errors.join(', ')}`,
                timestamp: new Date().toISOString()
            };
        }
        const openai = initializeClient(config);
        await openai.models.list();
        return {
            status: 'healthy',
            message: 'OpenAI service is operational',
            timestamp: new Date().toISOString()
        };
    }
    catch (error) {
        return {
            status: 'error',
            message: `OpenAI service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            timestamp: new Date().toISOString()
        };
    }
};
exports.getStatus = getStatus;
const processText = async (request, config) => {
    try {
        const validation = (0, exports.validateConfig)(config);
        if (!validation.isValid) {
            throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`);
        }
        const openai = initializeClient(config);
        const chatRequest = {
            model: config.model || 'gpt-3.5-turbo',
            messages: request.messages,
            max_tokens: request.maxTokens || 1000,
            temperature: request.temperature || 0.7,
            top_p: request.topP || 1,
            frequency_penalty: request.frequencyPenalty || 0,
            presence_penalty: request.presencePenalty || 0,
            ...(request.stream && { stream: request.stream })
        };
        const response = await openai.chat.completions.create({
            ...chatRequest,
            stream: false
        });
        const choices = response.choices.map((choice) => ({
            index: choice.index,
            message: {
                role: choice.message.role,
                content: choice.message.content || ''
            },
            finishReason: choice.finish_reason || 'unknown'
        }));
        return {
            id: response.id,
            object: response.object,
            created: response.created,
            model: response.model,
            choices,
            usage: {
                promptTokens: response.usage?.prompt_tokens || 0,
                completionTokens: response.usage?.completion_tokens || 0,
                totalTokens: response.usage?.total_tokens || 0
            }
        };
    }
    catch (error) {
        throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
exports.processText = processText;
const generateCompletion = async (prompt, config, options) => {
    const request = {
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ],
        maxTokens: options?.maxTokens || 1000,
        temperature: options?.temperature || 0.7,
        model: options?.model || config.model || 'gpt-3.5-turbo'
    };
    const response = await (0, exports.processText)(request, config);
    if (response.choices.length === 0) {
        throw new Error('No response generated');
    }
    return response.choices[0]?.message.content || '';
};
exports.generateCompletion = generateCompletion;
const analyzeText = async (text, config, analysisType = 'summarize', targetLanguage) => {
    let prompt = '';
    switch (analysisType) {
        case 'summarize':
            prompt = `Please provide a concise summary of the following text:\n\n${text}`;
            break;
        case 'extract':
            prompt = `Please extract the key information from the following text:\n\n${text}`;
            break;
        case 'classify':
            prompt = `Please classify the following text and explain what type of document or content it is:\n\n${text}`;
            break;
        case 'translate':
            const language = targetLanguage || 'English';
            prompt = `Please translate the following text to ${language}:\n\n${text}`;
            break;
        default:
            prompt = `Please analyze the following text:\n\n${text}`;
    }
    return await (0, exports.generateCompletion)(prompt, config);
};
exports.analyzeText = analyzeText;
//# sourceMappingURL=openai.service.js.map