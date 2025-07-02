import { Request, Response, NextFunction } from 'express';
import FileTemplateService from '../modules/filetemplate/service';
import { csvRowsSchema } from '../modules/filetemplate/validation';
import HttpException from '../utils/api/httpException';
import { ZodError } from 'zod';
import multer from 'multer';

// export const mediaRequest = async (
//   req: Request,
//   _res: Response,
//   next: NextFunction,
// ) => {
//   console.log("111111111111111111111111111111111")
//   try {
//     const file = req.file;

//     if (!file || !file.buffer) {
//       throw new HttpException(400, 'No file uploaded or file buffer is missing');
//     }

//     // Parse using buffer and mimetype
//     const parsedData = await FileTemplateService.parseFileFromBuffer(
//       file.buffer,
//       file.mimetype,
//       file.originalname,
//     );

//     // Validate with Zod schema
//     // const validatedData = csvRowsSchema.parse(parsedData);

//     // // Format the validated data (if needed)
//     // const formattedData = validatedData.map((item) => ({
//     //   fullName: item['Full Name'],
//     //   email: item['Email'],
//     //   address: item['Address'],
//     //   dateOfBirth: item['Date of Birth'],
//     //   gender: item['Gender'],
//     //   courseName: item['Course Name'],
//     // }));
//     console.log(parsedData, "-----------------------")

//     req.body = parsedData;
//     next();
//   } catch (err) {
//     console.log(err, "-----------------------")
//     if (err instanceof ZodError) {
//       const formattedErrors = err.errors.map((e) => {
//         const rowIndex = (e.path[0] as number) + 1;
//         const field = e.path[1];
//         return `Row ${rowIndex}: ${field} - ${e.message}`;
//       });

//       return next(
//         new HttpException(
//           422,
//           `Validation failed: ${formattedErrors.join('; ')}`,
//         ),
//       );
//     }

//     if (err instanceof HttpException) {
//       return next(err);
//     }

//     next(new HttpException(500, 'Something went wrong during file parsing'));
//   }
// };
