import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to validate image file types only
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/tiff',
    'image/bmp',
    'image/webp'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Supported image types: ${allowedMimeTypes.join(', ')}`));
  }
};

// Multer configuration for single image upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for images
    files: 1 // Only allow one file at a time
  }
});

// Middleware for single image upload
export const uploadSingle = upload.single('image');

// Error handling middleware for multer
export const handleUploadError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'Image file too large. Maximum size is 5MB.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files. Only one image file is allowed.'
      });
    }
  }
  
  if (err.message.includes('Unsupported file type')) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      error: 'Unexpected file field. Please use field name "image".'
    });
  }

  next(err);
};

