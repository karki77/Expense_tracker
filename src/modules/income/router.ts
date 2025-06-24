import { Router } from 'express';
import bodyValidator from '#utils/validators/bodyValidator';
import paramValidator from '#utils/validators/paramValidator';
import IncomeController from './controller';
import {
  addIncomeSchema,
  getIncomeByIdSchema,
  getAllUserIncomesSchema,
  updateIncomeSchema,
  deleteIncomeSchema,
} from './validation';
import authMiddleware from '../../middleware/authMiddleware';

const incomeRouter = Router();

incomeRouter.post(
  '/add-income',
  authMiddleware.authMiddleware,
  bodyValidator(addIncomeSchema),
  IncomeController.addIncome.bind(IncomeController),
);

incomeRouter.get(
  '/get-income/:incomeId',
  authMiddleware.authMiddleware,
  paramValidator(getIncomeByIdSchema),
  IncomeController.getIncomeById.bind(IncomeController),
);

incomeRouter.get(
  '/get-all-incomes/:userId',
  authMiddleware.authMiddleware,
  paramValidator(getAllUserIncomesSchema),
  IncomeController.getallUserIncomes.bind(IncomeController),
);

incomeRouter.patch(
  '/update-income/:incomeId',
  authMiddleware.authMiddleware,
  paramValidator(getIncomeByIdSchema),
  bodyValidator(updateIncomeSchema),
  IncomeController.updateIncome.bind(IncomeController),
);

incomeRouter.delete(
  '/delete-income/:incomeId',
  authMiddleware.authMiddleware,
  paramValidator(deleteIncomeSchema),
  IncomeController.deleteIncome.bind(IncomeController),
);

export default incomeRouter;
