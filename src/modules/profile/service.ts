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
      include: {
        user: {
          select: {
            id: true,
            email: true,
            isVerified: true,
          },
        },
      },
    });
    if (!profile) {
      throw new HttpException(404, 'Profile not found');
    }
    return profile;
  }
  async uploadProfileImage(userId: string, filename: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException(400, 'User not found');
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        profile: filename,
      },
    });

    return { filename };
  }
  /**
   * Update user profile
   */
  async updateProfile(
    profileId: string,
    userId: string,
    data: IUpdateProfileSchema,
  ) {
    const profile = await prisma.profile.update({
      where: { id: profileId, userId },
      data: {
        firstname: data.firstName,
        lastname: data.lastName,
        username: data.userName,
        image: data.image,
      },
      include: {
        user: true,
      },
    });
    return profile;
  }
}

export default new ProfileService();
