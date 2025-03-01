import { Request, Response, NextFunction } from 'express';
import { ValidationError, DatabaseError, UniqueConstraintError } from 'sequelize';
import logger from '../utils/logger';

// Custom error class for API errors
export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Error handler middleware
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error:', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Handle Sequelize validation errors
  if (error instanceof ValidationError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors: error.errors.map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }))
    });
  }

  // Handle Sequelize unique constraint errors
  if (error instanceof UniqueConstraintError) {
    return res.status(409).json({
      status: 'error',
      message: 'Duplicate Entry',
      errors: error.errors.map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }))
    });
  }

  // Handle Sequelize database errors
  if (error instanceof DatabaseError) {
    return res.status(500).json({
      status: 'error',
      message: 'Database Error',
      code: 'DB_ERROR'
    });
  }

  // Handle custom API errors
  if (error instanceof APIError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      code: error.code,
      data: error.data
    });
  }

  // Handle all other errors
  const statusCode = error instanceof APIError ? error.statusCode : 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal Server Error'
    : error.message;

  return res.status(statusCode).json({
    status: 'error',
    message,
    code: 'INTERNAL_ERROR'
  });
};
