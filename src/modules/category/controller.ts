import { Request, Response, NextFunction } from 'express';
import {
  ICategoryParamSchema,
  ICreateCategorySchema,
  IUpdateCategoryDataSchema,
} from './validation';
import CategoryService from './service';
import { HttpResponse } from '../../utils/api/httpResponse';
import HttpException from '../../utils/api/httpException';

class CategoryController {
  private categoryService = CategoryService;

  /**
   * Get category by Id
   */
  public async getCategoryById(
    req: Request<{ categoryId: string }, unknown, ICategoryParamSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user.id;
      const categoryId = req.params.categoryId;
      const category = await this.categoryService._getCategoryById(
        categoryId,
        userId,
      );
      res.send(
        new HttpResponse({
          message: 'Category retrieved successfully',
          data: category,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

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

      const response = await this.categoryService.createCategory(
        { name, description },
        userId,
      );

      res.send(
        new HttpResponse({
          message: 'Category created successfully',
          data: response,
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
      const response = await this.categoryService.updateCategory(
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
  /**
   * Delete a category
   */
  public async deleteCategory(
    req: Request<{ categoryId: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException(401, 'User is not authenticated');
      }
      const categoryId = req.params.categoryId;
      await this.categoryService.deleteCategory(categoryId, userId);
      res.send(
        new HttpResponse({
          message: 'Category deleted successfully',
        }),
      );
    } catch (error) {
      next(error);
    }
  }
}
export default new CategoryController();
