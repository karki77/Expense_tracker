import { z } from 'zod';

export const addIncomeSchema = z
  .object({
    amount: z
      .number({
        required_error: 'Amount is required',
        invalid_type_error: 'Amount must be a number',
      })
      .min(1, { message: 'Amount must be greater than 0' }),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid start date',
    }),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid end date',
    }),
    categoryId: z.string({
      required_error: 'Category is required',
      invalid_type_error: 'Category must be a string',
    }),
    userId: z.string({
      required_error: 'User is required',
      invalid_type_error: 'User must be a string',
    }),
    isRecurring: z.boolean().optional().default(false),
    period: z
      .enum(['WEEKLY', 'MONTHLY', 'YEARLY'])
      .optional()
      .default('MONTHLY'),
  })
  .strict({
    message: 'All fields are required',
  });

export type AddIncomeSchema = z.infer<typeof addIncomeSchema>;
