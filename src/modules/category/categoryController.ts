import { Request, Response, NextFunction } from 'express';
import { ICreateCategorySchema, IUpdateCategoryDataSchema } from './validation';
import CategoryService from './categoryService';
import { HttpResponse } from '../../utils/api/httpResponse';
import HttpException from '../../utils/api/httpException';

class CategoryController {
  /**
   * Create a new category
   */
  public async createCategory(
    req: Request<unknown, unknown, ICreateCategorySchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { name, description } = req.body;

      const userId = req.user.id;

      const response = await CategoryService.createCategory(
        { name, description },
        userId,
      );

      res.send(
        new HttpResponse({
          message: 'Category created successfully',
          data: response.data,
        }),
      );
    } catch (error) {
      next(error);
    }
  }
  /**
   * Update a category
   */
  public async updateCategory(
    req: Request<{ categoryId: string }, unknown, IUpdateCategoryDataSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException(401, 'User is not authenticated');
      }
      const categoryId = req.params.categoryId;
      const response = await CategoryService.updateCategory(
        userId,
        categoryId,
        req.body,
      );
      res.send(
        new HttpResponse({
          message: 'Category updated successfully',
          data: response.data,
        }),
      );
    } catch (error) {
      next(error);
    }
  }
}
export default new CategoryController();
