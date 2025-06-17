import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from '#utils/api/httpResponse';
import type { AddIncomeSchema } from './validation';
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
}
export default new IncomeController();
