import { prisma } from '../../config/setup/dbSetup';
import type { IAddExpenseSchema, IUpdateExpenseSchema } from './validation';
import HttpException from '../../utils/api/httpException';
import { IPaginationSchema } from '#utils/validators/commonValidation';
import { pagination, getPageDocs } from '#utils/pagination/pagination';

/**
 * Expense Service
 */

class ExpenseService {
  /**
   * Create a new expense
   */
  async addExpense(userId: string, data: IAddExpenseSchema) {
    const existingExpense = await prisma.expense.findFirst({
      where: {
        name: data.name,
        userId,
      },
    });
    if (existingExpense) {
      throw new HttpException(400, 'expense with this name already exists');
    }

    const category = await prisma.category.findFirst({
      where: {
        id: data.categoryId,
        userId,
      },
    });

    if (!category) {
      throw new HttpException(
        404,
        'Selected category not found or does not belong to user',
      );
    }

    const newExpense = await prisma.expense.create({
      data: {
        name: data.name,
        amount: data.amount,
        date: data.date,
        description: data.description,
        userId,
        categoryId: data.categoryId,
      },
      include: {
        category: true,
      },
    });

    return newExpense;
  }
  /**
   * Private function: Only use as a utility function
   * Get expense by id and user id
   */
  async _getExpenseById(expenseId: string, userId: string) {
    const expense = await prisma.expense.findFirst({
      where: {
        id: expenseId,
        userId,
      },
      include: {
        category: true,
      },
    });

    if (!expense) {
      throw new HttpException(404, 'Expense not found');
    }

    return expense;
  }
  /**
   * Get all expenses of a user
   */
  async getAllExpenses(userId: string, query: IPaginationSchema) {
    const { skip, limit, page } = pagination({
      limit: query.limit,
      page: query.page,
    });

    const [expenses, count] = await Promise.all([
      await prisma.expense.findMany({
        where: {
          userId,
        },
        take: limit,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      await prisma.expense.count({
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

    return { expenses, docs };
  }
  /**
   * Update an expense
   */
  async updateExpense(
    expenseId: string,
    userId: string,
    data: IUpdateExpenseSchema,
  ) {
    const expense = await this._getExpenseById(expenseId, userId);
    if (data.name && data.name !== expense.name) {
      const existingExpense = await prisma.expense.findFirst({
        where: {
          name: data.name,
          userId,
          NOT: {
            id: expenseId,
          },
        },
      });
      if (existingExpense) {
        throw new HttpException(400, 'Expense with this name already exists');
      }
    }
    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId, userId: userId },
      data: {
        ...data,
      },
      include: {
        category: true,
      },
    });
    return updatedExpense;
  }
  /**
   * Delete an expense
   */
  async deleteExpense(expenseId: string, userId: string) {
    await this._getExpenseById(expenseId, userId);
    await prisma.expense.delete({
      where: { id: expenseId },
    });
  }
}

export default new ExpenseService();
