import { string, z } from 'zod';

export const getProfileSchema = z
  .object({
    userId: z
      .string({ required_error: 'User ID is required' })
      .uuid({ message: 'Invalid User ID' }),
  })
  .strict({
    message: 'Only user ID is allowed to be passed',
  });

export const checkUsernameAvailabilitySchema = z.object({
  username: z.string({ required_error: 'Username is required' }),
});

export const updateProfileSchema = z
  .object({
    firstName: z
      .string({ required_error: 'First name is required' })
      .optional(),
    lastName: z.string({ required_error: 'Last name is required' }).optional(),
    userName: z.string({ required_error: 'Username is required' }).optional(),
    image: z.string({ required_error: 'Image is required' }).optional(),
  })
  .strict({
    message:
      'Only firstName, lastName, userName, and image are allowed to be updated',
  });

export const deleteProfileSchema = z.object({
  userId: z
    .string({ required_error: 'User ID is required' })
    .uuid({ message: 'Invalid User ID' }),
});

export const updateFinancialDataSchema = z
  .object({
    totalExpenses: z
      .number({
        required_error: 'Total expenses is required',
        invalid_type_error: 'Total expenses must be a number',
      })
      .optional(),
    totalIncomes: z
      .number({
        required_error: 'Total incomes is required',
        invalid_type_error: 'Total incomes must be a number',
      })
      .optional(),
    monthlyExpenses: z
      .number({
        required_error: 'Monthly expenses is required',
        invalid_type_error: 'Monthly expenses must be a number',
      })
      .optional(),
    monthlyIncomes: z
      .number({
        required_error: 'Monthly incomes is required',
        invalid_type_error: 'Monthly incomes must be a number',
      })
      .optional(),
  })
  .strict({
    message:
      'Only totalExpenses, totalIncomes, monthlyExpenses, and monthlyIncomes are allowed to be updated',
  });

export const topExpensesSchema = z.object({
  category: z.string({
    required_error: 'Category is required',
    invalid_type_error: 'Category must be a string',
  }),
  amount: z.number({
    required_error: 'Amount is required',
    invalid_type_error: 'Amount must be a number',
  }),
});

export type IGetProfileSchema = z.infer<typeof getProfileSchema>;
export type IUpdateProfileSchema = z.infer<typeof updateProfileSchema>;
export type IDeleteProfileSchema = z.infer<typeof deleteProfileSchema>;
export type ICheckUsernameAvailabilitySchema = z.infer<
  typeof checkUsernameAvailabilitySchema
>;
export type IUpdateFinancialDataSchema = z.infer<
  typeof updateFinancialDataSchema
>;
export type ITopExpensesSchema = z.infer<typeof topExpensesSchema>;
