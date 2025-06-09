import { Router } from 'express';
import bodyValidator from '../../utils/validators/bodyValidator';
import queryValidator from '../../utils/validators/queryValidator';
import {
  registerUserSchema,
  verifyEmailQuerySchema,
  loginUserSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  tokenSchema,
} from './validation';
import authController from './authController';
import { authMiddleware } from '../../middleware/authMiddleware';

const authrouter = Router();

authrouter.post(
  '/register',
  bodyValidator(registerUserSchema),
  authController.registerUser.bind(authController),
);

authrouter.get(
  '/verify-email',
  queryValidator(verifyEmailQuerySchema),
  authController.verifyEmail.bind(authController),
);

authrouter.post(
  '/login',
  bodyValidator(loginUserSchema),
  authController.loginUser.bind(authController),
);

authrouter.patch(
  '/change-password',
  authMiddleware,
  bodyValidator(changePasswordSchema),
  authController.changePassword.bind(authController),
);

authrouter.post(
  '/forgot-password',
  bodyValidator(forgotPasswordSchema),
  authController.requestPasswordReset.bind(authController),
);

export default authrouter;
