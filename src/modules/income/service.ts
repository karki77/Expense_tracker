import { prisma } from '../../config/setup/dbSetup';
import type { AddIncomeSchema, UpdateIncomeSchema } from './validation';
import HttpException from '../../utils/api/httpException';
import { IPaginationSchema } from '#utils/validators/commonValidation';
import { pagination, getPageDocs } from '#utils/pagination/pagination';

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

  /**
   * get all incomes
   */
  async getallUserIncomes(userId: string, query: IPaginationSchema) {
    const { skip, limit, page } = pagination({
      limit: query.limit,
      page: query.page,
    });

    const [incomes, count] = await Promise.all([
      await prisma.income.findMany({
        where: {
          userId,
        },
        take: limit,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.expense.count(),
    ]);

    const docs = getPageDocs({
      page,
      limit,
      count,
    });
    return { incomes, docs };
  }
  /**
   * update income
   */
  async updateIncome(
    incomeId: string,
    userId: string,
    data: UpdateIncomeSchema,
  ) {
    const income = await this.getIncomeById(incomeId, userId);

    const updatedIncome = await prisma.income.update({
      where: { id: incomeId, userId },
      data: {
        amount: data.amount,
        startDate: data.startDate,
        endDate: data.endDate,
        isRecurring: data.isRecurring,
        period: data.period,
      },
      include: {
        category: true,
      },
    });
    return updatedIncome;
  }
}
export default new IncomeService();
