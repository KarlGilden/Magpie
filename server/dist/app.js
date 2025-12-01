"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const documentai_service_1 = require("./services/documentai.service");
const openai_service_1 = require("./services/openai.service");
const upload_middleware_1 = require("./middleware/upload.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = parseInt(process.env['PORT'] || '3000', 10);
const documentAIConfig = {
    projectId: process.env['GOOGLE_CLOUD_PROJECT_ID'] || '',
    location: process.env['GOOGLE_CLOUD_LOCATION'] || 'us',
    processorId: process.env['GOOGLE_CLOUD_PROCESSOR_ID'] || '',
    credentialsPath: process.env['GOOGLE_APPLICATION_CREDENTIALS'] || ''
};
const documentAIService = (0, documentai_service_1.createDocumentAIService)(documentAIConfig);
const openAIConfig = {
    apiKey: process.env['OPEN_AI_API_KEY'] || '',
    model: process.env['OPENAI_MODEL'] || 'gpt-3.5-turbo',
    organization: process.env['OPENAI_ORGANIZATION'] || ''
};
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (_req, res) => {
    res.json({
        message: 'Welcome to WordCapture API',
        version: '1.0.0',
        status: 'running'
    });
});
app.get('/health', (_req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});
app.post('/api/process-image', upload_middleware_1.uploadSingle, upload_middleware_1.handleUploadError, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No image file uploaded. Please provide an image file using field name "image".'
            });
        }
        console.log("processing image");
        const result = await documentAIService.processDocument(req.file);
        if (result.success) {
            console.log(result.data?.text);
            res.json({
                ...result,
                imageInfo: {
                    originalName: req.file.originalname,
                    size: req.file.size,
                    mimeType: req.file.mimetype
                }
            });
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        console.error('Image processing error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during image processing'
        });
    }
});
app.get('/api/documentai/status', async (_req, res) => {
    try {
        const status = await documentAIService.getStatus();
        res.json(status);
    }
    catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({
            status: 'error',
            error: 'Failed to check Document AI service status'
        });
    }
});
app.post('/api/openai/chat', async (req, res) => {
    try {
        const request = req.body;
        if (!request.messages || !Array.isArray(request.messages) || request.messages.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Messages array is required and must not be empty'
            });
        }
        const result = await (0, openai_service_1.processText)(request, openAIConfig);
        res.json({
            success: true,
            data: result,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('OpenAI chat error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'OpenAI API error'
        });
    }
});
app.post('/api/openai/analyze', async (req, res) => {
    try {
        const { text, analysisType = 'summarize', targetLanguage } = req.body;
        if (!text || typeof text !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Text content is required'
            });
        }
        const result = await (0, openai_service_1.analyzeText)(text, openAIConfig, analysisType, targetLanguage);
        res.json({
            success: true,
            data: {
                text: result,
                analysisType,
                originalText: text
            },
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('OpenAI analyze error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'OpenAI analysis error'
        });
    }
});
app.get('/api/openai/status', async (_req, res) => {
    try {
        const status = await (0, openai_service_1.getStatus)(openAIConfig);
        res.json(status);
    }
    catch (error) {
        console.error('OpenAI status check error:', error);
        res.status(500).json({
            status: 'error',
            error: 'Failed to check OpenAI service status'
        });
    }
});
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
    });
});
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env['NODE_ENV'] === 'development' ? err.message : 'Internal server error'
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});
exports.default = app;
//# sourceMappingURL=app.js.map