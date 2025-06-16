import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from '../../utils/api/httpResponse';
import type {
  IAddExpenseSchema,
  IGetExpenseByIdSchema,
  IGetAllExpensesSchema,
} from './validation';

import ExpenseService from './service';
import { IPaginationSchema } from '#utils/validators/commonValidation';

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
    req: Request<IGetExpenseByIdSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user.id;
      const expenseId = req.params.expenseId;
      const expense = await this.expenseService._getExpenseById(
        expenseId,
        userId,
      );
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
  /**
   * Get all expenses
   */
  public async getAllExpenses(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user.id;
      const expenses = await this.expenseService.getAllExpenses(
        userId,
        req.query as IPaginationSchema,
      );

      res.send(
        new HttpResponse({
          message: 'Expenses retrieved successfully',
          data: expenses,
        }),
      );
    } catch (error) {
      next(error);
    }
  }
}
export default new ExpenseController();
