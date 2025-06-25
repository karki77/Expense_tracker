import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from '../../utils/api/httpResponse';
import HttpException from '../../utils/api/httpException';
import type {
  IRegisterUserSchema,
  IVerifyEmailQuerySchema,
  ILoginUserSchema,
  IChangePasswordSchema,
  IForgotPasswordSchema,
  IResetPasswordSchema,
  ITokenSchema,
} from './validation';
import AuthService from './service';

export class AuthController {
  private authService = AuthService;
  /**
   * Register User
   */
  public async registerUser(
    req: Request<unknown, unknown, IRegisterUserSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await this.authService.registerUser(req.body);
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
  /**
   * Verify Email
   */
  public async verifyEmail(
    req: Request<unknown, unknown, unknown, IVerifyEmailQuerySchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // Extract token from query
      const { token } = req.query;
      await this.authService.verifyEmail({ token });

      res.send(
        new HttpResponse({
          message: 'Email verified successfully',
        }),
      );
    } catch (error) {
      next(error);
    }
  }
  /**
   * Login User
   */
  public async loginUser(
    req: Request<unknown, unknown, ILoginUserSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const response = await this.authService.loginUser(req.body);
      res.send(
        new HttpResponse({
          message: 'Login successful',
          data: response,
        }),
      );
    } catch (error) {
      next(error);
    }
  }
  /**
   * Logout User with Redis Blacklist
   */
  async logoutUser(req: Request, res: Response, next: NextFunction) {
    try {
      const token =
        req.headers.authorization?.replace('Bearer ', '') || req.cookies.token;

      if (!token) {
        throw new HttpException(400, 'No token provided');
      }

      // Get user ID from the authenticated request
      const userId = req.user?.id;

      if (!userId) {
        throw new HttpException(400, 'User ID not found');
      }

      // Call the logout service method
      const result = await AuthService.logoutUser(userId, token);

      // Clear refresh token cookie
      res.clearCookie('refreshToken');
      res.clearCookie('token'); // Clear token cookie if stored
      res.send(
        new HttpResponse({
          message: 'User logged out successfully',
        }),
      );
    } catch (error) {
      next(error);
    }
  }
  /**
   * Change Password
   */
  public async changePassword(
    req: Request<unknown, unknown, IChangePasswordSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user.id;

      await this.authService.changePassword(userId, req.body);
      res.send(
        new HttpResponse({
          message: 'Password changed successfully',
        }),
      );
    } catch (error) {
      next(error);
    }
  }
  /**
   * Forget Password
   */
  public async requestPasswordReset(
    req: Request<unknown, unknown, IForgotPasswordSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await this.authService.requestPasswordReset(req.body);
      res.send(
        new HttpResponse({
          message: 'Password reset email sent successfully',
        }),
      );
    } catch (error) {
      next(error);
    }
  }
  /**
   * Reset Password
   */
  public async resetPassword(
    req: Request<unknown, unknown, IResetPasswordSchema, ITokenSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await this.authService.resetPassword(req.query.token, req.body.password);
      res.send(
        new HttpResponse({
          message: 'Password reset successfully',
        }),
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
