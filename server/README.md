# WordCapture

A Word Capture application built with Express.js and TypeScript.

## Features

- Express.js server with TypeScript
- Type safety and better development experience
- Security middleware (Helmet)
- CORS enabled
- Request logging with Morgan
- Environment variable support
- Error handling with proper types
- Health check endpoint
- Hot reloading in development

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Start the development server (with hot reloading):
```bash
npm run dev
```

4. Build and start the production server:
```bash
npm run build
npm start
```

### Available Scripts

- `npm run dev` - Start the development server with hot reloading
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the production server
- `npm run dev:build` - Build and run with nodemon
- `npm run clean` - Clean the dist directory
- `npm test` - Run tests (placeholder)

### API Endpoints

- `GET /` - Welcome message and API info
- `GET /health` - Health check endpoint
- `POST /api/process-image` - Process a single image using Google Document AI
- `GET /api/documentai/status` - Check Document AI service status

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=development
PORT=3000

# Google Cloud Document AI Configuration
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_LOCATION=us
GOOGLE_CLOUD_PROCESSOR_ID=your-processor-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
```

## Project Structure

```
wordcapture/
├── src/
│   ├── app.ts                    # Main application file (TypeScript)
│   ├── types/
│   │   └── documentai.types.ts   # Document AI type definitions
│   ├── services/
│   │   └── documentai.service.ts # Document AI service layer
│   └── middleware/
│       └── upload.middleware.ts  # File upload middleware
├── dist/               # Compiled JavaScript (generated)
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## Development

The server runs on `http://localhost:3000` by default. You can change the port by setting the `PORT` environment variable.

### TypeScript Configuration

The project uses strict TypeScript configuration for better type safety:
- Strict mode enabled
- No implicit any
- Unused variables/parameters detection
- Source maps for debugging

## Document AI Integration

This project includes Google Cloud Document AI integration for processing documents:

### Features
- Image text extraction (OCR)
- Entity recognition and extraction
- Confidence scoring
- Support for image formats (JPEG, PNG, TIFF, BMP, WebP)

### Usage
1. Set up your Google Cloud project and enable Document AI API
2. Create a processor in the Document AI console
3. Configure the environment variables with your project details
4. Upload images via the `/api/process-image` endpoint

### Image Processing

#### Single Image Processing
- **Endpoint**: `POST /api/process-image`
- **Field name**: `image`
- **Max size**: 5MB
- **Supported types**: JPEG, PNG, TIFF, BMP, WebP

### Multer Configuration
Image uploads use multer with:
- Memory storage for processing
- Image file type validation
- 5MB size limit
- Comprehensive error handling

## License

ISC
