import { z } from 'zod';

export const csvRowSchema = z
  .object({
    'First Name': z
      .string({
        message: 'First name is required',
      })
      .min(1, {
        message: 'First name must be at least 1 character long',
      }),
    'Last Name': z
      .string({
        message: 'Last name is required',
      })
      .min(1, {
        message: 'Last name must be at least 1 character long',
      }),
    email: z.string().email({
      message: 'Email is invalid',
    }),
    course: z
      .string({
        message: 'Course is required',
      })
      .min(1, {
        message: 'Course must be at least 1 character long',
      }),
    batch: z
      .string({
        message: 'Batch is required',
      })
      .min(1, {
        message: 'Batch must be at least 1 character long',
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
