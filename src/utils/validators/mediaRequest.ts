import { NextFunction, Request, Response } from 'express';
import HttpException from '../api/httpException';

/**
 * Media Request Middleware
 */
export const mediaRequest = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const file = req?.file;

    if (!file) {
      throw new HttpException(400, 'File is required');
    }

    const payload = {
      image: file?.filename,
    };

    req.body = payload;
    next();
  } catch (error) {
    next(error);
    console.log(error);
  }
};
