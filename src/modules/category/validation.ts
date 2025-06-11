import { z } from 'zod';

export const createCategorySchema = z
  .object({
    name: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
      })
      .toLowerCase()
      .min(1, { message: 'Name must be at least 1 character' })
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
  })
  .strict({
    message: 'Extra fields are not allowed in the request body',
  });

export const updateCategoryDataSchema = z
  .object({
    name: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
      })
      .min(1, 'Category name is required')
      .max(50, 'Category name must be less than 50 characters')
      .trim()
      .optional(),
    description: z
      .string()
      .max(200, 'Description must be less than 200 characters')
      .optional()
      .transform((val) => val?.trim() || undefined),
  })
  .strict({
    message: 'Extra fields are not allowed in the request body',
  });

export const categoryParamSchema = z
  .object({
    categoryId: z
      .string({
        required_error: 'Category ID is required',
        invalid_type_error: 'Category ID must be a string',
      })
      .uuid('Invalid category ID'),
  })
  .strict({
    message: 'Extra fields are not allowed in the categoryId parameter',
  });

export const deleteCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid category ID'),
  }),
});

export const getCategoryByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid category ID'),
  }),
});

export type ICreateCategorySchema = z.infer<typeof createCategorySchema>;
export type IUpdateCategoryDataSchema = z.infer<
  typeof updateCategoryDataSchema
>;
export type IDeleteCategorySchema = z.infer<typeof deleteCategorySchema>;
export type IGetCategoryByIdSchema = z.infer<typeof getCategoryByIdSchema>;
export type ICategoryParamSchema = z.infer<typeof categoryParamSchema>;
