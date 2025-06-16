import { Router } from 'express';
import bodyValidator from '../../utils/validators/bodyValidator';
import paramValidator from '../../utils/validators/paramValidator';
import {
  createCategorySchema,
  updateCategoryDataSchema,
  categoryParamSchema,
} from './validation';
import { userIdParamSchema } from '../../config/setup/userValidation';
import CategoryController from './controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import queryValidator from '../../utils/validators/queryValidator';
import { paginationSchema } from '../../utils/validators/commonValidation';

const categoryRouter = Router();

categoryRouter.post(
  '/create',
  authMiddleware,
  bodyValidator(createCategorySchema),
  CategoryController.createCategory.bind(CategoryController),
);

categoryRouter.get(
  '/get/:categoryId',
  authMiddleware,
  paramValidator(categoryParamSchema),
  CategoryController.getCategoryById.bind(CategoryController),
);

categoryRouter.get(
  '/getallcategories/:userId', //pagination
  authMiddleware,
  paramValidator(userIdParamSchema),
  queryValidator(paginationSchema),
  CategoryController.getallCategories.bind(CategoryController),
);

categoryRouter.patch(
  '/update/:categoryId',
  authMiddleware,
  paramValidator(categoryParamSchema),
  bodyValidator(updateCategoryDataSchema),
  CategoryController.updateCategory.bind(CategoryController),
);

categoryRouter.delete(
  '/delete/:categoryId',
  authMiddleware,
  paramValidator(categoryParamSchema),
  CategoryController.deleteCategory.bind(CategoryController),
);

export default categoryRouter;
