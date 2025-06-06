import type { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import HttpException from '../utils/api/httpException';
import logger from 'config/setup/logSetup';
const errorMiddleware = (
  error: Error | HttpException,
  _req: Request,
  res: Response,
  next: NextFunction,
): any => {
  logger.error('Error caught in middleware:', error);

  // Check if res.status is a function
  if (typeof res.status !== 'function') {
    logger.error('res.status is not a function. res object:', res);
    // Attempt to use res.writeHead and res.end as a fallback
    try {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          success: false,
          message: 'Internal Server Error',
          details: 'Error handling middleware encountered an unexpected issue.',
        }),
      );
    } catch (fallbackError) {
      logger.error('Failed to send fallback response:', fallbackError);
      next(error); // Pass the original error to the default Express error handler
    }
    return;
  }

  // Rest of the error handling logic
  if (error instanceof PrismaClientKnownRequestError) {
    return res.status(400).json({
      success: false,
      message: 'Database Error',
    });
  }

  if (error instanceof HttpException) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error',
      // stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }

  // For any other type of error
  return res.status(500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
  });
};

export default errorMiddleware;
