import { Router } from 'express';
import bodyValidator from '../../utils/validators/bodyValidator';
import paramValidator from '../../utils/validators/paramValidator';
import {
  createCategorySchema,
  updateCategoryDataSchema,
  categoryParamSchema,
} from './validation';
import CategoryController from './categoryController';
import { authMiddleware } from '../../middleware/authMiddleware';

const categoryRouter = Router();

categoryRouter.post(
  '/create',
  authMiddleware,
  bodyValidator(createCategorySchema),
  CategoryController.createCategory,
);

categoryRouter.patch(
  '/update/:categoryId',
  authMiddleware,
  paramValidator(categoryParamSchema),
  bodyValidator(updateCategoryDataSchema),
  CategoryController.updateCategory,
);

categoryRouter.delete(
  '/delete/:categoryId',
  authMiddleware,
  paramValidator(categoryParamSchema),
  CategoryController.deleteCategory,
);

export default categoryRouter;
