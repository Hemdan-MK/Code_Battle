import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import jwt from 'jsonwebtoken';

 const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('Error:', error);

    // Zod validation errors
    if (error instanceof ZodError) {
        res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }))
        });
        return;
    }

    // JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
        return;
    }

    if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({
            success: false,
            message: 'Token expired'
        });
        return;
    }

    // MongoDB duplicate key error
    if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        res.status(400).json({
            success: false,
            message: `${field} already exists`
        });
        return;
    }

    // Custom application errors
    if (error.message) {
        res.status(400).json({
            success: false,
            message: error.message
        });
        return;
    }

    // Default server error
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
};
export default errorHandler;