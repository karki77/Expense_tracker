import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from '#utils/api/httpResponse';
import type {
  AddIncomeSchema,
  GetIncomeByIdSchema,
  GetAllUserIncomesSchema,
} from './validation';
import { IPaginationSchema } from '#utils/validators/commonValidation';
import IncomeService from './service';

export class IncomeController {
  private readonly IncomeService = IncomeService;
  /**
   * Add income
   */
  async addIncome(
    req: Request<unknown, unknown, AddIncomeSchema>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user.id;
      const income = await this.IncomeService.addIncome(userId, req.body);
      res.send(
        new HttpResponse({
          message: 'Income added successfully',
          data: income,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * get income by id
   */
  async getIncomeById(
    req: Request<GetIncomeByIdSchema, unknown, unknown>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user.id;
      const incomeId = req.params.incomeId;
      const income = await this.IncomeService.getIncomeById(incomeId, userId);
      res.send(
        new HttpResponse({
          message: 'Income fetched successfully',
          data: income,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * get all incomes
   */
  async getallUserIncomes(
    req: Request<GetAllUserIncomesSchema>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user.id;
      const incomes = await this.IncomeService.getallUserIncomes(
        userId,
        req.query as IPaginationSchema,
      );
      res.send(
        new HttpResponse({
          message: 'Incomes fetched successfully',
          data: incomes,
        }),
      );
    } catch (error) {
      next(error);
    }
  }
}
export default new IncomeController();
