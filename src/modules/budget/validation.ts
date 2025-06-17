import { z } from 'zod';

export const addIncomeSchema = z.object({
  amount: z
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .min(1, { message: 'Amount must be greater than 0' }),
  date: z.date({
    required_error: 'Date is required',
    invalid_type_error: 'Date must be a date',
  }),
  description: z.string({
    required_error: 'Description is required',
    invalid_type_error: 'Description must be a string',
  }),
  period: z.enum(['WEEKLY', 'MONTHLY', 'YEARLY'], {
    required_error: 'Period is required',
    invalid_type_error: 'Period must be a string',
  }),
});
