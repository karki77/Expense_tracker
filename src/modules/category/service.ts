import { prisma } from '../../config/setup/dbSetup';
import HttpException from '../../utils/api/httpException';
import { ICreateCategorySchema, IUpdateCategoryDataSchema } from './validation';
import { defaultCategories } from '../../config/setup/defaultCategories';
import e from 'express';

class CategoryService {
  /**
   * Get categories for expense dropdown
   */
  async getCategories(userId: string) {
    //check if user has many categories
    let categories = await prisma.category.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });

    // If no category exist, create default ones
    if (categories.length === 0 && defaultCategories.length > 0) {
      await prisma.category.createMany({
        data: defaultCategories.map((category) => ({
          ...category,
          userId,
        })),
      });
    }

    //fetch the newly created categories
    const response = await prisma.category.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        description: true,
      },
      orderBy: { name: 'asc' },
    });

    return response;
  }

  /**
   * create a custom category
   */

  async createCategory(data: ICreateCategorySchema, userId: string) {
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
    const newCategory = await prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        userId,
      },
    });
    return newCategory;
  }
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
   * Update a category
   */
  async updateCategory(
    userId: string,
    categoryId: string,
    data: IUpdateCategoryDataSchema,
  ) {
    //input validation
    if (!userId || !categoryId) {
      throw new HttpException(400, 'User ID and Category ID are requiered');
    }

    if (!data || Object.keys(data).length === 0) {
      throw new HttpException(400, 'Data is requiered to update');
    }

    // check if category exists and belongs to the specific user
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: userId,
      },
    });
    if (!category) {
      throw new HttpException(404, 'Category not found or access denied');
    }
    // check name uniqueness only if name is being updated

    if (data.name && data.name !== category.name) {
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
    }
    //safe update with user ownership check
    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
        userId: userId,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
    return updatedCategory;
  }
  /**
   * Delete a category
   */
  async deleteCategory(categoryId: string, userId: string) {
    await this._getCategoryById(categoryId, userId);
    //validate inputs
    if (!categoryId || !userId) {
      throw new HttpException(400, 'Category ID and User ID are requiered');
    }
    //check if category exists and belongs to the user in  a single query
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: userId,
      },
    });
    if (!category) {
      throw new HttpException(404, 'Category not found or access deneid');
    }
    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
  }
}
export default new CategoryService();
