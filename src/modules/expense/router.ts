import { Router } from 'express';
import bodyValidator from '../../utils/validators/bodyValidator';
import { addExpenseSchema } from './validation';
import ExpenseController from './controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const expenseRouter = Router();

expenseRouter.post(
  '/create',
  authMiddleware,
  bodyValidator(addExpenseSchema),
  ExpenseController.addExpense.bind(ExpenseController),
);

expenseRouter.get(
  '/:expenseId',
  authMiddleware,
  ExpenseController.getExpenseById.bind(ExpenseController),
);

export default expenseRouter;
