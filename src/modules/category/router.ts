import { Router } from 'express';
import bodyValidator from '../../utils/validators/bodyValidator';
import { createCategorySchema } from './validation';
import CategoryController from './categoryController';
import { authMiddleware } from '../../middleware/authMiddleware';

const categoryRouter = Router();

categoryRouter.post(
  '/create',
  authMiddleware,
  bodyValidator(createCategorySchema),
  CategoryController.createCategory,
);

export default categoryRouter;
