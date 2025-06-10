import { Request, Response, NextFunction } from 'express';
import HttpException from '../../utils/api/httpException';
import { ICreateCategorySchema } from './validation';
import CategoryService from './categoryService';

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

      await CategoryService.createCategory({ name, description }, userId);

      res.send({
        message: 'Category created successfully',
        data: {
          name,
          description,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
