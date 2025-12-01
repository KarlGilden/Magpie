"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocumentAIService = exports.getStatus = exports.processDocument = exports.validateConfig = void 0;
const documentai_1 = require("@google-cloud/documentai");
let client = null;
const initializeClient = (config) => {
    if (client) {
        return client;
    }
    if (config.credentialsPath) {
        process.env['GOOGLE_APPLICATION_CREDENTIALS'] = config.credentialsPath;
    }
    client = new documentai_1.DocumentProcessorServiceClient();
    return client;
};
const validateConfig = (config) => {
    const errors = [];
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
exports.validateConfig = validateConfig;
const validateFile = (file) => {
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
    const maxSize = 5 * 1024 * 1024;
    if (file.size && file.size > maxSize) {
        throw new Error(`Image file too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
    }
};
const extractEntities = (pages) => {
    return pages.flatMap(page => page.entities?.map((entity) => ({
        type: entity.type,
        value: entity.value,
        confidence: entity.confidence || 0,
        boundingBox: entity.boundingBox ? {
            x: entity.boundingBox.normalizedVertices?.[0]?.x || 0,
            y: entity.boundingBox.normalizedVertices?.[0]?.y || 0,
            width: (entity.boundingBox.normalizedVertices?.[2]?.x || 0) - (entity.boundingBox.normalizedVertices?.[0]?.x || 0),
            height: (entity.boundingBox.normalizedVertices?.[2]?.y || 0) - (entity.boundingBox.normalizedVertices?.[0]?.y || 0)
        } : undefined
    })) || []);
};
const extractPages = (pages) => {
    return pages.map(page => ({
        pageNumber: page.pageNumber || 0,
        text: page.text || '',
        entities: page.entities?.map((entity) => ({
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
            page.entities.reduce((sum, entity) => sum + (entity.confidence || 0), 0) / page.entities.length : 0
    }));
};
const calculateAverageConfidence = (entities) => {
    return entities.length > 0
        ? entities.reduce((sum, entity) => sum + entity.confidence, 0) / entities.length
        : 0;
};
const processDocument = (config) => {
    return async (file) => {
        const startTime = Date.now();
        try {
            validateFile(file);
            const documentClient = initializeClient(config);
            const request = {
                name: `projects/${config.projectId}/locations/${config.location}/processors/${config.processorId}`,
                rawDocument: {
                    content: file.buffer.toString('base64'),
                    mimeType: file.mimetype
                }
            };
            console.log("LOG: ", request);
            const [result] = await documentClient.processDocument(request);
            const response = result;
            const document = response.document;
            const text = document.text || '';
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
        }
        catch (error) {
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
exports.processDocument = processDocument;
const getStatus = (config) => {
    return async () => {
        try {
            const validation = (0, exports.validateConfig)(config);
            return {
                status: validation.isValid ? 'ready' : 'configuration_error',
                config,
                errors: validation.errors
            };
        }
        catch (error) {
            console.error('Status check error:', error);
            return {
                status: 'error',
                config,
                errors: [error instanceof Error ? error.message : 'Unknown error']
            };
        }
    };
};
exports.getStatus = getStatus;
const createDocumentAIService = (config) => {
    return {
        processDocument: (0, exports.processDocument)(config),
        getStatus: (0, exports.getStatus)(config),
        validateConfig: () => (0, exports.validateConfig)(config)
    };
};
exports.createDocumentAIService = createDocumentAIService;
//# sourceMappingURL=documentai.service.js.map