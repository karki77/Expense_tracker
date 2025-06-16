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
        name: data.name,
        userId,
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

    //
    return newExpense;
  }
  /**
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

    if (!expense) throw new HttpException(404, 'Expense not found');

    //
    return expense;
  }
  /**
   * Get all expenses
   */
  async _getAllExpenses(userId: string) {
    const expenses = await prisma.expense.findMany({
      where: { userId },
      include: {
        category: true,
      },
    });

    //
    return expenses;
  }
}

export default new ExpenseService();
