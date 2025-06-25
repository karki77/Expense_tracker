import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from '../../utils/api/httpResponse';
import type {
  IAddExpenseSchema,
  IGetExpenseByIdSchema,
  IGetAllExpensesSchema,
  IUpdateExpenseSchema,
  IDeleteExpenseSchema,
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
    req: Request<IGetAllExpensesSchema>,
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
  /**
   * Update an expense
   */
  public async updateExpense(
    req: Request<IGetExpenseByIdSchema, unknown, IUpdateExpenseSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user.id;
      const expenseId = req.params.expenseId;

      const updatedExpense = await this.expenseService.updateExpense(
        expenseId,
        userId,
        req.body,
      );
      res.send(
        new HttpResponse({
          message: 'Expense updated successfully',
          data: updatedExpense,
        }),
      );
    } catch (error) {
      next(error);
    }
  }
  /**
   * Delete an expense
   */
  public async deleteExpense(
    req: Request<IDeleteExpenseSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user.id;
      const expenseId = req.params.expenseId;
      await this.expenseService.deleteExpense(expenseId, userId);
      res.send(
        new HttpResponse({
          message: 'Expense deleted successfully',
        }),
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new ExpenseController();
