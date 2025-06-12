import { prisma } from '../../config/setup/dbSetup';
import type { ICreateExpenseSchema } from './validation';
import HttpException from '../../utils/api/httpException';

/**
 * Expense Service
 */

class ExpenseService {
  async createExpense(userId: string, data: ICreateExpenseSchema) {
    const existingExpense = await prisma.expense.findFirst({
      where: {
        userId,
        id: data.name,
      },
    });
    if (existingExpense) {
      throw new HttpException(400, 'expense with this name already exists');
    }
    const category = await prisma.category.findUnique({
      where: {
        id: data.category,
      },
    });
    if (!category) {
      throw new HttpException(400, 'category not found');
    }
    const newExpense = await prisma.expense.create({
      data: {
        name: data.name,
        amount: data.amount,
        date: data.date,
        description: data.description,
        userId,
        categoryId: data.category,
        isRecurring: false,
        recurringInterval: 'MONTHLY',
      },
      include: {
        category: true,
      },
    });

    return {
      data: newExpense,
    };
  }
}

export default new ExpenseService();
