import { z } from 'zod';
export const createExpenseSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(3, 'Name must be at least 3 characters long'),

    amount: z
      .number({ required_error: 'Amount is required' })
      .min(1, 'Amount must be at least 1'),

    date: z.string({ required_error: 'Date is required' }),

    category: z.string({ required_error: 'Category is required' }),

    description: z
      .string({ required_error: 'Description is required' })
      .trim()
      .min(10, 'Description must be at least 10 characters long'),
  })
  .strict({
    message: 'All fields are required, no missing fields accepted',
  });

export type ICreateExpenseSchema = z.infer<typeof createExpenseSchema>;
