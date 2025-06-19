import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from '#utils/api/httpResponse';
import ProfileService from './service';
import {
  IGetProfileSchema,
  IUpdateProfileSchema,
  IDeleteProfileSchema,
} from './validation';
import HttpException from '../../utils/api/httpException';

export class ProfileController {
  private ProfileService = ProfileService;
  /**
   * Get user profile by Id
   */
  async getUserProfile(
    req: Request<IGetProfileSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user.id;
      const profile = await this.ProfileService.getUserProfile(userId);
      res.send(
        new HttpResponse({
          message: 'User profile retrieved successfully',
          data: profile,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload Profile Image
   */
  public async uploadProfileImage(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user.id;

      // Check if file exists in request
      if (!req.file) {
        throw new HttpException(400, 'No file uploaded');
      }

      console.log('Uploaded file:', req.file);

      // Just use the filename
      const filename = req.file.filename;
      console.log('Filename:', filename);

      // Update user profile with just the filename
      await this.ProfileService.uploadProfileImage(userId, filename);

      res.send(
        new HttpResponse({
          message: 'Profile image uploaded successfully',
          data: { filename },
        }),
      );
    } catch (error) {
      next(error);
    }
  }
  /**
   * Update user profile
   */
  async updateProfile(
    req: Request<IGetProfileSchema, unknown, IUpdateProfileSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user.id;

      const profile = await this.ProfileService.updateProfile(
        userId,
        req.body,
        req.file,
      );
      res.send(
        new HttpResponse({
          message: 'User profile updated successfully',
          data: profile,
        }),
      );
    } catch (error) {
      next(error);
    }
  }
  /**
   * Delete user profile
   */
  async deleteProfile(
    req: Request<IDeleteProfileSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user.id;
      await this.ProfileService.deleteProfile(userId);
      res.send(
        new HttpResponse({
          message: 'User profile deleted successfully',
        }),
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new ProfileController();
