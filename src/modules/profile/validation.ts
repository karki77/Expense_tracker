import { z } from 'zod';

export const getProfileSchema = z
  .object({
    profileId: z
      .string({ required_error: 'Profile ID is required' })
      .uuid({ message: 'Invalid Profile ID' }),
  })
  .strict({
    message: 'Only user ID is allowed to be passed',
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
      'Only first name, last name, username, and image are allowed to be updated',
  });

export type IGetProfileSchema = z.infer<typeof getProfileSchema>;
export type IUpdateProfileSchema = z.infer<typeof updateProfileSchema>;
