import { Router } from 'express';
import bodyValidator from '../../utils/validators/bodyValidator';
import { createExpenseSchema } from './validation';
import ExpenseController from './controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const expenseRouter = Router();

expenseRouter.post(
  '/create',
  authMiddleware,
  bodyValidator(createExpenseSchema),
  ExpenseController.createExpense.bind(ExpenseController),
);

export default expenseRouter;
