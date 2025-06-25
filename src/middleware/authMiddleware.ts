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

export class authMiddleware {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(envConfig.redis.url || 'redis://localhost:6379');
  }

  // Generate tokens (access & refresh)
  generateTokens(user: IUser) {
    const payload = { id: user.id, email: user.email };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_ACCESS!, {
      expiresIn: '7d',
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH!, {
      expiresIn: '15d',
    });
    return { accessToken, refreshToken };
  }

  // Verify generic token using main secret
  verifyToken(token: string): IUser {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as IUser;
      return decoded;
    } catch (e) {
      throw new HttpException(401, 'Invalid or expired token');
    }
  }

  // Basic auth middleware verifying access token
  authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        throw new HttpException(401, 'Authentication required');
      }
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_ACCESS!,
      ) as IUser;
      req.user = decoded;
      next();
    } catch (err: any) {
      if (err instanceof jwt.JsonWebTokenError) {
        next(new HttpException(401, 'Invalid or expired token'));
      } else {
        next(err);
      }
    }
  };

  // Middleware with Redis blacklist check
  authMiddlewareWithRedis = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      // Check for token in Authorization header or cookies
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : req.cookies.token;
      if (!token) {
        throw new HttpException(401, 'No token provided');
      }
      // Check if token is blacklisted in Redis
      const isBlacklisted = await this.redis.get(`blacklist:${token}`);
      if (isBlacklisted)
        throw new HttpException(401, 'Token has been invalidated');

      // Verify the token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_ACCESS!,
      ) as IUser;
      if (typeof decoded === 'string')
        throw new HttpException(401, 'Invalid token format');
      // Fetch user from database
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) throw new HttpException(401, 'User not found');

      req.user = { id: user.id, email: user.email };
      next();
    } catch (err) {
      next(err);
    }
  };
}

export default new authMiddleware();
