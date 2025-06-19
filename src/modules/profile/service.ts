import { IUpdateProfileSchema, IUpdateFinancialDataSchema } from './validation';
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

    await prisma.profile.update({
      where: { userId: userId },
      data: {
        image: filename,
      },
    });

    return { filename };
  }
  /**
   * Check if username is available
   */
  async isUsernameAvailable(username: string, currentUserId: string) {
    const existingUser = await prisma.user.findFirst({
      where: {
        username: username,
        id: {
          not: currentUserId,
        },
      },
    });
    return !existingUser;
  }
  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: IUpdateProfileSchema,
    file?: Express.Multer.File,
  ) {
    // check if username is being updated and if it is available
    if (data.userName) {
      const isAvailable = await this.isUsernameAvailable(data.userName, userId);
      if (!isAvailable) {
        throw new HttpException(400, 'Username is already taken');
      }
      const updateData = {
        firstname: data.firstName,
        lastname: data.lastName,
        username: data.userName,
        image: data.image,
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

    /**
     * Update financial data
     */
  }
}

export default new ProfileService();
