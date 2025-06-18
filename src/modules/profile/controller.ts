import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from '#utils/api/httpResponse';
import ProfileService from './service';
import { IGetProfileSchema } from './validation';

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
      const profileId = req.params.profileId;
      const profile = await this.ProfileService.getUserProfile(
        profileId,
        userId,
      );
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
}

export default new ProfileController();
