import { ZodError } from 'zod';

//
import type { ZodTypeAny } from 'zod';
import type { Request, Response, NextFunction } from 'express';

/**
 * Param validator
 */
const paramValidator =
  (schema: ZodTypeAny) =>
  (
    req: Request<unknown, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction,
  ): void => {
    try {
      req.params = schema.parse(req.params);

      next();
      return;
    } catch (error) {
      const errorObj =
        error instanceof ZodError ? error.flatten().fieldErrors : {};

      res.status(422).json({
        success: false,
        message: 'Param validation error!',
        errors: errorObj,
      });
      return;
    }
  };

export default paramValidator;
