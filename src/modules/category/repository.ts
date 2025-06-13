import { PrismaClient, Category } from '@prisma/client';

type CategoryWithStats = Category & {
  _count: {
    expenses: number;
    budgets: number;
  };
  expenses: {
    amount: number;
    date: Date;
  }[];
};

export class CategoryRepository {
  constructor(private prisma: PrismaClient) {}
  async create(data: {
    name: string;
    description?: string;
    userId: string;
  }): Promise<Category> {
    return await this.prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        userId: data.userId,
      },
    });
  }

  async findById(id: string, userId: string): Promise<Category | null> {
    return await this.prisma.category.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async findbyName(name: string, userId: string): Promise<Category | null> {
    return await this.prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
        userId,
      },
    });
  }

  async findByNameExcludingId(
    name: string,
    userId: string,
    excludeId: string,
  ): Promise<Category | null> {
    return await this.prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
        userId,
        id: {
          not: excludeId,
        },
      },
    });
  }

  async findAllByUser(userId: string): Promise<CategoryWithStats[]> {
    const categories = await this.prisma.category.findMany({
      where: {
        userId,
      },
      include: {
        _count: {
          select: {
            expenses: true,
            budgets: true,
          },
        },
        expenses: {
          select: {
            amount: true,
            date: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return categories;
  }

  async update(
    id: string,
    userId: string,
    data: {
      name?: string;
      description?: string;
    },
  ): Promise<Category> {
    return await this.prisma.category.update({
      where: {
        id,
        userId,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }
  async delete(id: string, userId: string): Promise<boolean> {
    try {
      // get. check
      await this.prisma.category.delete({
        where: {
          id,
          userId,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
  async getExpenseCount(categoryId: string, userId: string): Promise<number> {
    return await this.prisma.expense.count({
      where: {
        categoryId,
        userId,
      },
    });
  }

  async getBudgetCount(categoryId: string, userId: string): Promise<number> {
    return await this.prisma.budget.count({
      where: {
        categoryId,
        userId,
      },
    });
  }
}
