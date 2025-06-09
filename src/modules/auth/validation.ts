import { z } from 'zod';

export const registerUserSchema = z
  .object({
    firstname: z
      .string({
        required_error: 'firstname is required',
        invalid_type_error: 'firstname must be a string',
      })
      .toLowerCase()
      .min(1, { message: 'firstname must be at least of 1 character' }),
    lastname: z
      .string({
        required_error: 'lastname is required',
        invalid_type_error: 'lastname must be a string',
      })
      .toLowerCase()
      .min(1, { message: 'lastname must be at least of 1 character' }),

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

export const verifyEmailQuerySchema = z
  .object({
    token: z.string({
      required_error: 'Verification token is required',
      invalid_type_error: 'Verification token must be a string',
    }),
  })
  .strict({
    message: 'Extra fields are not allowed in the verification data',
  });

export const loginUserSchema = z
  .object({
    email: z.string().toLowerCase().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
  })
  .strict({
    message: 'Extra fields are not allowed in the login data',
  });

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, { message: 'Old password must be at least 8 characters long' }),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(8, { message: 'New password must be at least 8 characters long' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
        message:
          'New password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
      }),
  })
  .strict({
    message: 'Extra fields are not allowed in the change password data',
  });

export const forgotPasswordSchema = z
  .object({
    email: z.string().email('Invalid email format'),
  })
  .strict({
    message: 'Extra fields are not allowed in the forget password data',
  });

export const tokenSchema = z
  .object({
    token: z
      .string({
        required_error: 'Token is required',
        invalid_type_error: 'Token must be a string',
      })
      .min(1, {
        message: 'Token must be at least 1 character long',
      }),
  })
  .strict({
    message: 'Extra fields are not allowed in the reset password data',
  });

export const resetPasswordSchema = z
  .object({
    password: z
      .string({
        required_error: 'Password is required',
        invalid_type_error: 'Password should be string',
      })
      .min(6, 'Password can not be less than 6 character')
      .max(20, 'Password can not be more than 20 character')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
        message:
          'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
      }),
  })
  .strict({
    message: 'Extra fields are not allowed in the reset password data',
  });

export type IRegisterUserSchema = z.infer<typeof registerUserSchema>;
export type IVerifyEmailQuerySchema = z.infer<typeof verifyEmailQuerySchema>;
export type ILoginUserSchema = z.infer<typeof loginUserSchema>;
export type IChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export type IForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ITokenSchema = z.infer<typeof tokenSchema>;
export type IResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
