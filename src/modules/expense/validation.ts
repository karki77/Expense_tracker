import { z } from 'zod';
export const addExpenseSchema = z
  .object({
    amount: z
      .number({ required_error: 'Amount is required' })
      .min(1, 'Amount must be at least 1'),

    date: z.string({ required_error: 'Date is required' }),

    categoryId: z.string({ required_error: 'CategoryId is required' }),

    description: z
      .string({ required_error: 'Description is required' })
      .trim()
      .min(10, 'Description must be at least 10 characters long'),
  })
  .strict({
    message: 'All fields are required, no missing fields accepted',
  });

export const getExpenseByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid expense ID'),
  }),
});

export type IAddExpenseSchema = z.infer<typeof addExpenseSchema>;
export type IGetExpenseByIdSchema = z.infer<typeof getExpenseByIdSchema>;
