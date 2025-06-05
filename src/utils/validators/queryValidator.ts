import { ZodError } from 'zod';

//
import type { ZodTypeAny } from 'zod';
import type { Request, Response, NextFunction } from 'express';

/**
 * Query validator
 */
const queryValidator =
  (schema: ZodTypeAny) =>
  (
    req: Request<unknown, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction,
  ): void => {
    try {
      const validated = schema.parse(req.query);
      (req as any).validatedQuery = validated;
      next();
    } catch (error) {
      const errorObj =
        error instanceof ZodError ? error.flatten().fieldErrors : {};
      const errorMessage =
        errorObj[Object.keys(errorObj)[0]]?.[0] || 'Invalid query';
      res.status(422).json({
        success: false,
        message: errorMessage,
        errors: error,
      });
    }
  };

//
export default queryValidator;
