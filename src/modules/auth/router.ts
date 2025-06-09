import { Router } from 'express';
import bodyValidator from '../../utils/validators/bodyValidator';
import queryValidator from '../../utils/validators/queryValidator';
import {
  registerUserSchema,
  verifyEmailQuerySchema,
  loginUserSchema,
} from './validation';
import authController from './authController';

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

export default authrouter;
