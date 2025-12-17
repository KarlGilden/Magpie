import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/error.types';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction ) => {
    console.error(err.stack); // Log the error stack for server-side debugging

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }

    return res.status(500).json({
        success: false,
        message: 'Something went wrong. Please try again later.',
    });
}