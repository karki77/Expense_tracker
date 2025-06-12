import { prisma } from '../../config/setup/dbSetup';
import type { IAddExpenseSchema } from './validation';
import HttpException from '../../utils/api/httpException';

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
        userId,
        name: data.name,
      },
    });
    if (existingExpense) {
      throw new HttpException(400, 'expense with this name already exists');
    }
    //
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

    return {
      data: newExpense,
    };
  }
  /**
   * Get expense by id and user id
   */
  async _getExpenseById(id: string, userId: string) {
    const expense = await prisma.expense.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        category: true,
      },
    });
    return {
      data: expense,
    };
  }
}

export default new ExpenseService();
