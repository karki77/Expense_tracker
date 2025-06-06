import rateLimit from 'express-rate-limit';
import HttpException from '../utils/api/httpException';

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 requests per `windowMs`
  message: new HttpException(
    429,
    'Too many login attempts, please try again later.',
  ),
  standardHeaders: true,
  legacyHeaders: false,
});
