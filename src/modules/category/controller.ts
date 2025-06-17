import { Request, Response, NextFunction } from 'express';
import type {
  ICategoryParamSchema,
  ICreateCategorySchema,
  IDeleteCategorySchema,
  IUpdateCategoryDataSchema,
} from './validation';
import CategoryService from './service';
import { HttpResponse } from '../../utils/api/httpResponse';
import { IPaginationSchema } from '#utils/validators/commonValidation';

class CategoryController {
  private categoryService = CategoryService;

  /**
   * Get category by Id
   */
  public async getCategoryById(
    req: Request<ICategoryParamSchema>,
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
   * Get all categories
   */
  public async getallCategories(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user.id;
      const { categories, docs } = await this.categoryService.getallCategories(
        userId,
        req.query as IPaginationSchema,
      );
      const filteredCategories = categories.map(
        (category: {
          id: string;
          name: string;
          description: string | null;
        }) => ({
          id: category.id,
          name: category.name,
          description: category.description,
        }),
      );
      res.send(
        new HttpResponse({
          message: 'Categories retrieved successfully',
          data: filteredCategories,
          docs,
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
    req: Request<ICategoryParamSchema, unknown, IUpdateCategoryDataSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user.id;
      const categoryId = req.params.categoryId;

      const updatedCategory = await this.categoryService.updateCategory(
        userId,
        categoryId,
        req.body,
      );
      res.send(
        new HttpResponse({
          message: 'Category updated successfully',
          data: updatedCategory,
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
    req: Request<{ categoryId: string }, unknown, IDeleteCategorySchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user.id;
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
