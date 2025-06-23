import { z } from 'zod';
const MIN_DATE = new Date('2024-01-01');
export const addExpenseSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .min(1, 'Name must not be empty'),
    amount: z
      .number({ required_error: 'Amount is required' })
      .min(1, 'Amount must be greater than 0'),

    date: z.string({ required_error: 'Date is required' }).refine(
      (val) => {
        const parsed = new Date(val);
        return !isNaN(parsed.getTime()) && parsed >= MIN_DATE;
      },
      {
        message: 'Date must be on or after 2024-01-01',
      },
    ),

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
  expenseId: z
    .string({
      required_error: 'Expense ID is required',
      invalid_type_error: 'Expense ID must be a UUID',
    })
    .uuid('Expense ID must be a valid UUID'),
});

export const getAllExpensesSchema = z.object({
  userId: z
    .string({
      required_error: 'User ID is required',
      invalid_type_error: 'User ID must be a UUID',
    })
    .uuid('User ID must be a valid UUID'),
});

export const updateExpenseSchema = z
  .object({
    name: z.string().optional(),
    amount: z.number().optional(),
    date: z.string().optional(),
    description: z.string().optional(),
  })
  .strict({
    message: 'only the fields that are provided will be updated',
  });

export const deleteExpenseSchema = z.object({
  expenseId: z
    .string({
      required_error: 'Expense ID is required',
      invalid_type_error: 'Expense ID must be a UUID',
    })
    .uuid('Expense ID must be a valid UUID'),
});

export type IAddExpenseSchema = z.infer<typeof addExpenseSchema>;
export type IGetExpenseByIdSchema = z.infer<typeof getExpenseByIdSchema>;
export type IGetAllExpensesSchema = z.infer<typeof getAllExpensesSchema>;
export type IUpdateExpenseSchema = z.infer<typeof updateExpenseSchema>;
export type IDeleteExpenseSchema = z.infer<typeof deleteExpenseSchema>;
