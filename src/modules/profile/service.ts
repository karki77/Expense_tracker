import { IGetProfileSchema, IUpdateProfileSchema } from './validation';
import { prisma } from '../../config/setup/dbSetup';
import HttpException from '../../utils/api/httpException';

class ProfileService {
  /**
   * Get profile by user ID
   */
  async getUserProfile(profileId: string, userId: string) {
    const profile = await prisma.profile.findFirst({
      where: { id: profileId, userId },
    });
    if (!profile) {
      throw new HttpException(404, 'Profile not found');
    }
    return profile;
  }
}

export default new ProfileService();
