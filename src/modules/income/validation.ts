import { z } from 'zod';

const notInFuture = (val: string) => {
  const parsed = Date.parse(val);
  if (isNaN(parsed)) return false;
  return new Date(parsed) <= new Date(); // Must not be in the future
};
export const addIncomeSchema = z
  .object({
    amount: z
      .number({
        required_error: 'Amount is required',
        invalid_type_error: 'Amount must be a number',
      })
      .min(1, { message: 'Amount must be greater than 0' }),
    startDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid start date format',
      })
      .refine(notInFuture, {
        message: 'Start date cannot be in the future',
      }),

    endDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid end date format',
      })
      .refine(notInFuture, {
        message: 'End date cannot be in the future',
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

export const getIncomeByIdSchema = z.object({
  incomeId: z
    .string({
      required_error: 'Income ID is required',
      invalid_type_error: 'Expense ID must be a UUID',
    })
    .uuid('Expense ID must be a valid UUID'),
});

export const getAllUserIncomesSchema = z.object({
  userId: z
    .string({
      required_error: 'User ID is required',
      invalid_type_error: 'User ID must be a string',
    })
    .uuid('User ID must be a valid UUID'),
});

export const updateIncomeSchema = z
  .object({
    amount: z.number().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isRecurring: z.boolean().optional(),
    period: z.enum(['WEEKLY', 'MONTHLY', 'YEARLY']).optional(),
  })
  .strict({
    message:
      'only amount, startDate, endDate, isRecurring, period are allowed to be updated',
  });

export const deleteIncomeSchema = z.object({
  incomeId: z.string({
    required_error: 'Income ID is required',
    invalid_type_error: 'Income ID must be a string',
  }),
});

export type AddIncomeSchema = z.infer<typeof addIncomeSchema>;
export type GetIncomeByIdSchema = z.infer<typeof getIncomeByIdSchema>;
export type GetAllUserIncomesSchema = z.infer<typeof getAllUserIncomesSchema>;
export type UpdateIncomeSchema = z.infer<typeof updateIncomeSchema>;
export type DeleteIncomeSchema = z.infer<typeof deleteIncomeSchema>;
