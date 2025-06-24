import { Router } from 'express';
import bodyValidator from '../../utils/validators/bodyValidator';
import paramsValidator from '../../utils/validators/paramValidator';
import {
  addExpenseSchema,
  getExpenseByIdSchema,
  getAllExpensesSchema,
  updateExpenseSchema,
  deleteExpenseSchema,
} from './validation';
import ExpenseController from './controller';
import authMiddleware from '../../middleware/authMiddleware';

const expenseRouter = Router();

expenseRouter.post(
  '/create',
  authMiddleware.authMiddleware,
  bodyValidator(addExpenseSchema),
  ExpenseController.addExpense.bind(ExpenseController),
);

expenseRouter.get(
  '/:expenseId',
  authMiddleware.authMiddleware,
  paramsValidator(getExpenseByIdSchema),
  ExpenseController.getExpenseById.bind(ExpenseController),
);

expenseRouter.get(
  '/get-all-expenses/:userId',
  authMiddleware.authMiddleware,
  paramsValidator(getAllExpensesSchema),
  ExpenseController.getAllExpenses.bind(ExpenseController),
);

expenseRouter.patch(
  '/update/:expenseId',
  authMiddleware.authMiddleware,
  paramsValidator(getExpenseByIdSchema),
  bodyValidator(updateExpenseSchema),
  ExpenseController.updateExpense.bind(ExpenseController),
);

expenseRouter.delete(
  '/delete/:expenseId',
  authMiddleware.authMiddleware,
  paramsValidator(deleteExpenseSchema),
  ExpenseController.deleteExpense.bind(ExpenseController),
);

export default expenseRouter;
