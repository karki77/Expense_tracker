import { prisma } from '../../config/setup/dbSetup';
import type { AddIncomeSchema } from './validation';
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
}
export default new IncomeService();
