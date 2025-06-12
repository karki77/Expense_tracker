import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from '../../utils/api/httpResponse';
import HttpException from '../../utils/api/httpException';
import type { ICreateExpenseSchema } from './validation';

import ExpenseService from './service';

export class ExpenseController {
  private expenseService = ExpenseService;
  /**
   * Create a new expense
   */
  public async createExpense(
    req: Request<unknown, unknown, ICreateExpenseSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user.id;
      const data = req.body;
      const expense = await this.expenseService.createExpense(userId, data);
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
}

export default new ExpenseController();
