export enum ErrorType {
    Unknown = 1,
    SQL = 2,
    Syntax = 3
}

export interface ServerError {
    message?: string,
    type: ErrorType,
    status: 200 | 201 | 400 | 404 | 500
}

export interface SQLError extends ServerError{
    code: string,
    sqlState: string, 
    sqlMessage: string,
    sql: string
}

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

// Specific errors
export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

export class ValidationError extends AppError {
    constructor(message = "Invalid input") {
        super(message, 400);
    }
}