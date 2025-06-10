import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(50, { message: 'Name must be less than 50 characters' })
    .trim()
    .refine(
      (name) => name.length > 0,
      'Category name cannot be empty or whitespace',
    ),
  description: z
    .string()
    .max(200, { message: 'Description must be less than 200 characters' })
    .optional()
    .transform((val) => val?.trim() || undefined),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Category name is required')
      .max(50, 'Category name must be less than 50 characters')
      .trim()
      .optional(),
    description: z
      .string()
      .max(200, 'Description must be less than 200 characters')
      .optional()
      .transform((val) => val?.trim() || undefined),
  }),
  params: z.object({
    id: z.string().uuid('Invalid category ID'),
  }),
});

export const deleteCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid category ID'),
  }),
});
