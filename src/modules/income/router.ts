import { Router } from 'express';
import bodyValidator from '#utils/validators/bodyValidator';
import paramValidator from '#utils/validators/paramValidator';
import IncomeController from './controller';
import { addIncomeSchema, getIncomeByIdSchema } from './validation';
import { authMiddleware } from '../../middleware/authMiddleware';

const incomeRouter = Router();

incomeRouter.post(
  '/add-income',
  authMiddleware,
  bodyValidator(addIncomeSchema),
  IncomeController.addIncome.bind(IncomeController),
);

incomeRouter.get(
  '/get-income/:incomeId',
  authMiddleware,
  paramValidator(getIncomeByIdSchema),
  IncomeController.getIncomeById.bind(IncomeController),
);

export default incomeRouter;
