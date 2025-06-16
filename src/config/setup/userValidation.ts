import { z } from 'zod';

export const userIdParamSchema = z.object({
  userId: z
    .string({
      required_error: 'User ID is required',
      invalid_type_error: 'User ID must be a string',
    })
    .uuid('Invalid user ID'),
});

export type IUserIdParamSchema = z.infer<typeof userIdParamSchema>;
