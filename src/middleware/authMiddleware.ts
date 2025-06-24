import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import HttpException from '../utils/api/httpException';
import Redis from 'ioredis';
import envConfig from '../config/setup/envConfig';
import { prisma } from '../config/setup/dbSetup';

const redis = new Redis(envConfig.redis.url || 'redis://localhost:6379');
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

export const authMiddlewarewithRedis = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token: string =
      req.headers.authorization?.replace('Bearer ', '') || req.cookies.token;

    if (!token) {
      throw new HttpException(401, 'No token provided');
    }

    // Check Redis blacklist
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new HttpException(401, 'Token has been invalidated');
    }
    //continue with normal jwt verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS!);

    if (typeof decoded === 'string') {
      throw new HttpException(401, 'Invalid token format');
    }

    // If your payload uses 'id' instead of 'userId'
    const userId = (decoded as any).id || (decoded as any).userId;
    if (!userId) {
      throw new HttpException(401, 'Invalid token payload');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
