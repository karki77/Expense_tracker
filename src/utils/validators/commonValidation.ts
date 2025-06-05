import { z } from 'zod';

/**
 * Param ID validation schema
 */
export const paramIdSchema = z
  .object({
    id: z
      .string({
        required_error: 'ID is required',
        invalid_type_error: 'ID must be a UUID',
      })
      .uuid(),
  })
  .strict({
    message: 'Unexpected fields found in ID validation data',
  });

/**
 * Pagination validation schema
 */
export const paginationSchema = z.object({
  page: z
    .preprocess(
      (val) => Number(val),
      z
        .number({ invalid_type_error: 'Page must be a number' })
        .min(1, 'Page must be a positive number'),
    )
    .optional(),
  limit: z
    .preprocess(
      (val) => Number(val),
      z
        .number({ invalid_type_error: 'limit must be a number' })
        .min(1, 'Limit must be a positive number')
        .max(100, "limit can't be more than 100"),
    )
    .optional(),
});

export type IParamIdSchema = z.infer<typeof paramIdSchema>;
export type IPaginationSchema = z.infer<typeof paginationSchema>;
