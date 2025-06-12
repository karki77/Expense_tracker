import { prisma } from '../../config/setup/dbSetup';
import HttpException from '../../utils/api/httpException';
import { ICreateCategorySchema, IUpdateCategoryDataSchema } from './validation';

class CategoryService {
  /**
   * Get a category by id
   */
  async _getCategoryById(categoryId: string, userId: string) {
    const category = await prisma.category.findFirst({
      where: {
        userId,
        id: categoryId,
      },
    });

    if (!category) {
      throw new HttpException(404, 'Category not found');
    }

    return category;
  }

  /**
   * Create a category
   */
  async createCategory(data: ICreateCategorySchema, userId: string) {
    // Check if category with same name exists
    const existingCategory = await prisma.category.findUnique({
      where: {
        name_userId: {
          name: data.name,
          userId,
        },
      },
    });

    if (existingCategory) {
      throw new HttpException(400, 'Category with this name already exists');
    }

    // Create new category
    const newCategory = await prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        userId,
      },
    });

    //
    return newCategory;
  }
  /**
   * Update a category
   */
  async updateCategory(
    userId: string,
    categoryId: string,
    data: IUpdateCategoryDataSchema,
  ) {
    await this._getCategoryById(categoryId, userId);
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: data.name,
        userId,
        NOT: {
          id: categoryId,
        },
      },
    });
    if (existingCategory) {
      throw new HttpException(400, 'Category with this name already exists');
    }
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        ...data,
      },
    });
    return {
      data: updatedCategory,
    };
  }
  /**
   * Delete a category
   */
  async deleteCategory(categoryId: string, userId: string) {
    await this._getCategoryById(categoryId, userId);
    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
  }
}
export default new CategoryService();
