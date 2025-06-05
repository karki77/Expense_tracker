import { z } from 'zod';

export const createUserSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    username: z
      .string({
        required_error: 'Username is required',
        invalid_type_error: 'Username must be a string',
      })
      .toLowerCase()
      .trim()
      .min(3, { message: 'Username must be at least 3 characters long' })
      .max(20, { message: 'Username must be at most 20 characters long' })
      .regex(/^[a-zA-Z0-9]+$/, {
        message: 'Username can only contain letters and numbers',
      }),
    email: z
      .string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
      })
      .toLowerCase()
      .trim()
      .email({ message: 'Invalid email address' })
      .min(5, { message: 'Email must be at least 5 characters long' })
      .max(50, { message: 'Email must be at most 50 characters long' }),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
        message:
          'Password must include uppercase, lowercase, number, and special character',
      }),
  })
  .strict({
    message: 'Extra fields are not allowed in the registration data',
  });

export type CreateUserSchema = z.infer<typeof createUserSchema>;
