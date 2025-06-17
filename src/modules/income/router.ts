import { Router } from 'express';
import bodyValidator from '#utils/validators/bodyValidator';
import paramValidator from '#utils/validators/paramValidator';
import IncomeController from './controller';
import {
  addIncomeSchema,
  getIncomeByIdSchema,
  getAllUserIncomesSchema,
} from './validation';
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

incomeRouter.get(
  '/get-all-incomes/:userId',
  authMiddleware,
  paramValidator(getAllUserIncomesSchema),
  IncomeController.getallUserIncomes.bind(IncomeController),
);

export default incomeRouter;
