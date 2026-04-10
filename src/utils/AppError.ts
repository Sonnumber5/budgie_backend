// Custom error class that carries an HTTP status code alongside the error message.
export class AppError extends Error {
    statusCode: number;

    // Creates an AppError with a message and an associated HTTP status code.
    constructor(message: string, statusCode: number){
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}