import { prisma } from '../../config/setup/dbSetup';
import { Prisma, CategoryType } from '@prisma/client';
import HttpException from '../../utils/api/httpException';
import type {
  ICreateCategorySchema,
  IUpdateCategoryDataSchema,
} from './validation';
import {
  defaultExpenseCategories,
  defaultIncomeCategories,
} from '../../config/setup/defaultCategories';
import { getPageDocs, pagination } from '../../utils/pagination/pagination';
import type { IPaginationSchema } from '#utils/validators/commonValidation';

class CategoryService {
  /**
   * Get categories for dropdown filter(filter by type)
   */
  async getCategories(userId: string, type: CategoryType) {
    const whereClause: Prisma.CategoryWhereInput = {
      userId,
      ...(type && {
        OR: [{ type }, { type: CategoryType.BOTH }],
      }),
    };

    let categories = await prisma.category.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        type: true,
        icon: true,
        color: true,
      },
      orderBy: { name: 'asc' },
    });

    if (categories.length === 0) {
      await this.createDefaultCategories(userId);
      categories = await prisma.category.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          type: true,
          icon: true,
          color: true,
        },
        orderBy: { name: 'asc' },
      });
    }
    return categories;
  }
  /**
   * Get all categories with pagination
   */
  async getallCategories(
    userId: string,
    query: IPaginationSchema & { type: CategoryType },
  ) {
    const { skip, limit, page } = pagination({
      limit: query.limit,
      page: query.page,
    });

    const [categories, count] = await Promise.all([
      prisma.category.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          name: true,
          type: true,
          icon: true,
          color: true,
        },
        take: limit,
        skip,
        orderBy: { name: Prisma.SortOrder.asc },
      }),
      prisma.category.count({
        where: {
          userId,
        },
      }),
    ]);

    const docs = getPageDocs({
      page,
      limit,
      count,
    });

    return { categories, docs };
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

  async createDefaultCategories(userId: string) {
    const defaultCategories = [
      ...defaultExpenseCategories,
      ...defaultIncomeCategories,
    ].map((category) => ({
      ...category,
      userId,
      type: defaultExpenseCategories.includes(category)
        ? CategoryType.EXPENSE
        : CategoryType.INCOME,
    }));

    await prisma.category.createMany({
      data: defaultCategories,
    });
  }
}
export default new CategoryService();
