import { z } from 'zod';

export const csvRowSchema = z
  .object({
    'Full Name': z
      .string({
        message: 'Full name is required',
      })
      .min(1, {
        message: 'Full name must be at least 1 character long',
      }),
    Email: z.string({
      message: 'Email is required',
    }),
    Address: z
      .string({
        message: 'Address is required',
      })
      .min(1, {
        message: 'Address must be at least 1 character long',
      }),
    'Date of Birth': z
      .string({
        message: 'Date of Birth is required',
      })
      .min(1, {
        message: 'Date of Birth must be at least 1 character long',
      }),
    Gender: z.string({
      message: 'Gender is required',
    }),
    'Course Name': z.string({
      message: 'Course Name is required',
    }),
  })
  .strict({
    message: 'Row contains extra fields that are not allowed',
  });

export const filenameSchema = z.object({
  Filename: z.string({
    message: 'filename is required',
  }),
});
export const csvRowsSchema = z.array(csvRowSchema);

export type CsvRow = z.infer<typeof csvRowSchema>;
export type fileName = z.infer<typeof filenameSchema>;
