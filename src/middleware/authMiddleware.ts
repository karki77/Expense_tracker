import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import HttpException from '../utils/api/httpException';

// Define token payload type
interface IUser {
  id: string;
  email: string;
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

export type ITokenType = 'REFRESH_TOKEN' | 'ACCESS_TOKEN';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new HttpException(401, 'Authentication required');
    }

    const token = authHeader.split(' ')[1];
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_ACCESS as string,
    ) as IUser;

    // Add user to request object
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new HttpException(401, 'Invalid or expired token'));
    } else {
      next(error);
    }
  }
};

// Generate JWT token
export const generateToken = (user: IUser) => {
  const payload = {
    id: user.id,
    email: user.email,
  };

  const accessToken = jwt.sign(
    { ...payload },
    process.env.JWT_SECRET_ACCESS as string,
    { expiresIn: '7d' },
  );
  const refreshToken = jwt.sign(
    { ...payload },
    process.env.JWT_SECRET_REFRESH as string,
    { expiresIn: '15d' },
  );

  //
  return { accessToken, refreshToken };
};

export const verifyToken = (token: string): IUser => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as IUser;
    return decoded;
  } catch (error) {
    throw new HttpException(401, 'Invalid or expired token');
  }
};
