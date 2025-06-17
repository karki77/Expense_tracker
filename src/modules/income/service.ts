import { prisma } from '../../config/setup/dbSetup';
import type { AddIncomeSchema, UpdateIncomeSchema } from './validation';
import HttpException from '../../utils/api/httpException';

class IncomeService {
  /**
   * Add income
   */
  async addIncome(userId: string, data: AddIncomeSchema) {
    const existingIncome = await prisma.income.findFirst({
      where: {
        userId,
        categoryId: data.categoryId,
      },
    });
    if (existingIncome) {
      throw new HttpException(400, 'Income already exists');
    }
    const income = await prisma.income.create({
      data: {
        ...data,
        userId,
      },
      include: {
        category: true,
      },
    });
    return income;
  }

  /**
   * get income by id
   */
  async getIncomeById(incomeId: string, userId: string) {
    const income = await prisma.income.findFirst({
      where: { id: incomeId, userId },
      include: {
        category: true,
      },
    });
    if (!income) {
      throw new HttpException(404, 'Income not found');
    }
    return income;
  }
  async updateIncome(
    incomeId: string,
    userId: string,
    data: UpdateIncomeSchema,
  ) {
    const income = await prisma.income.update({
      where: { id: incomeId, userId },
      data,
    });
    return income;
  }
}
export default new IncomeService();
