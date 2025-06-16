import { prisma } from '../../config/setup/dbSetup';
import HttpException from '../../utils/api/httpException';
import { ICreateCategorySchema, IUpdateCategoryDataSchema } from './validation';
import { defaultCategories } from '../../config/setup/defaultCategories';
import { getPageDocs, pagination } from '../../utils/pagination/pagination';
import { IPaginationSchema } from '#utils/validators/commonValidation';

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
   * Get all categories with pagination
   */

  async getallCategories(userId: string, query: IPaginationSchema) {
    const { skip, limit, page } = pagination({
      limit: query.limit,
      page: query.page,
    });
    // If no categories exist, create default ones first
    const existingCount = await prisma.category.count({
      where: { userId },
    });

    if (existingCount === 0 && defaultCategories.length > 0) {
      await prisma.category.createMany({
        data: defaultCategories.map((category) => ({
          ...category,
          userId,
        })),
      });
    }
    const [categories, count] = await Promise.all([
      prisma.category.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          description: true,
        },
        take: limit,
        skip,
        orderBy: { name: 'asc' },
      }),
      prisma.category.count({
        where: { userId },
      }),
    ]);

    const docs = getPageDocs({
      page,
      limit,
      count,
    });

    return {
      categories,
      docs,
    };
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
    const category = await this._getCategoryById(categoryId, userId);

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
      },
    });

    return updatedCategory;
  }
  /**
   * Delete a category
   */
  async deleteCategory(categoryId: string, userId: string) {
    await this._getCategoryById(categoryId, userId);
    return await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
  }
}
export default new CategoryService();
