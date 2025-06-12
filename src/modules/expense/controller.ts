import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from '../../utils/api/httpResponse';
import type { IAddExpenseSchema, IGetExpenseByIdSchema } from './validation';

import ExpenseService from './service';

export class ExpenseController {
  private expenseService = ExpenseService;
  /**
   * Create a new expense
   */
  public async addExpense(
    req: Request<unknown, unknown, IAddExpenseSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user.id;
      const expense = await this.expenseService.addExpense(userId, req.body);
      res.send(
        new HttpResponse({
          message: 'Expense created successfully',
          data: expense,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get expense by id and user id
   */
  public async getExpenseById(
    req: Request<{ id: string }, unknown, IGetExpenseByIdSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id;
      const userId = req.user.id;
      const expense = await this.expenseService._getExpenseById(id, userId);
      res.send(
        new HttpResponse({
          message: 'Expense retrieved successfully',
          data: expense,
        }),
      );
    } catch (error) {
      next(error);
    }
  }
}
export default new ExpenseController();
