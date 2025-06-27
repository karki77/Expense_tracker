import { Request, Response, NextFunction } from 'express';
import CsvUploadService from '../modules/filesystem/service';
import { csvRowsSchema } from '../modules/filesystem/validation';
import HttpException from '#utils/api/httpException';
import { ZodError } from 'zod';

export const mediaRequest = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const filename = req.file?.filename;
    if (!filename) {
      throw new HttpException(400, 'No file uploaded');
    }

    const parsedData = await CsvUploadService.parseFile(filename);

    const validatedData = csvRowsSchema.parse(parsedData);
    const formattedData = validatedData?.map((item) => ({
      firstName: item['First Name'],
      lastName: item['Last Name'],
      email: item.email,
      course: item.course,
      batch: item.batch,
    }));

    req.body = formattedData;
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      // Format the ZodError into a human-readable array
      const formattedErrors = err.errors.map((e) => {
        const rowIndex = (e.path[0] as number) + 1; // Display row index starting from 1
        const field = e.path[1];
        return `Row ${rowIndex}: ${field} - ${e.message}`;
      });

      return next(
        new HttpException(
          422,
          `Validation failed: ${formattedErrors.join('; ')}`,
        ),
      );
    }

    if (err instanceof HttpException) {
      return next(err);
    }

    next(new HttpException(500, 'Something went wrong during CSV processing'));
  }
};
