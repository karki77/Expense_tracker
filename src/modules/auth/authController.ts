import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from '../../utils/api/httpResponse';
import { IRegisterUserSchema } from './validation';
import AuthService from './authService';
import { IPaginationSchema } from '../../utils/validators/commonValidation';

export class UserController {
  private userService = AuthService;

  /**
   * Register User
   */
  public async registerUser(
    req: Request<unknown, unknown, IRegisterUserSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await this.userService.registerUser(req.body);
      const filteredUsers = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      };
      res.send(
        new HttpResponse({
          message: 'User registered successfully',
          data: filteredUsers,
        }),
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
