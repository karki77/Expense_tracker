import { Router } from 'express';
import bodyValidator from '../../utils/validators/bodyValidator';
import queryValidator from '../../utils/validators/queryValidator';
import { registerUserSchema } from './validation';
import userController from './authController';

const authrouter = Router();

authrouter.post(
  '/register',
  bodyValidator(registerUserSchema),
  userController.registerUser.bind(userController),
);

export default authrouter;
