import { ZodError } from 'zod';

//
import type { ZodTypeAny } from 'zod';
import type { Request, Response, NextFunction } from 'express';

/**
 * Body validator
 */
const bodyValidator =
  (schema: ZodTypeAny) =>
  (
    req: Request<unknown, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction,
  ): void => {
    try {
      req.body = schema.parse(req.body);

      next();
      return;
    } catch (error) {
      if (error instanceof ZodError) {
        const firstErrorMessage = error?.issues[0]?.message || 'Invalid input';

        //
        res.status(400).json({
          success: false,
          message: firstErrorMessage,
          errors: error.issues,
        });
        return;
      }

      //
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred.',
      });
    }
  };

export default bodyValidator;
