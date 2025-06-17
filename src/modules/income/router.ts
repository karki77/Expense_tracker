import { Router } from 'express';
import bodyValidator from '#utils/validators/bodyValidator';
import IncomeController from './controller';
import { addIncomeSchema } from './validation';
import { authMiddleware } from '../../middleware/authMiddleware';

const incomeRouter = Router();

incomeRouter.post(
  '/add-income',
  authMiddleware,
  bodyValidator(addIncomeSchema),
  IncomeController.addIncome.bind(IncomeController),
);

export default incomeRouter;
