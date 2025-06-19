import { IGetProfileSchema, IUpdateProfileSchema } from './validation';
import { prisma } from '../../config/setup/dbSetup';
import HttpException from '../../utils/api/httpException';

class ProfileService {
  /**
   * Get profile by user ID
   */
  async getUserProfile(userId: string) {
    const profile = await prisma.profile.findFirst({
      where: { userId: userId },
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
      include: {
        userProfile: true,
      },
    });
    if (!user) {
      throw new HttpException(400, 'User not found');
    }
    if (!user.userProfile) {
      throw new HttpException(400, 'User profile not found');
    }

    const profile = await prisma.profile.update({
      where: { id: user.userProfile.id },
      data: {
        image: filename,
      },
    });

    return { filename };
  }
  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: IUpdateProfileSchema,
    file?: Express.Multer.File,
  ) {
    const updateData: any = {
      firstname: data.firstName,
      lastname: data.lastName,
      username: data.userName,
    };

    // If a file is uploaded, use its filename as the image
    if (file) {
      updateData.image = file.filename;
    } else if (data.image) {
      // If no file but image path provided in data
      updateData.image = data.image;
    }

    const profile = await prisma.profile.update({
      where: { userId: userId },
      data: updateData,
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
    return profile;
  }
}

export default new ProfileService();
