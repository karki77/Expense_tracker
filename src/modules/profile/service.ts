import { IUpdateProfileSchema } from './validation';
import path from 'path';
import fs from 'fs/promises';
import { prisma } from '../../config/setup/dbSetup';
import HttpException from '../../utils/api/httpException';

class ProfileService {
  /**
   * Get profile by user ID
   */
  async getUserProfile(userId: string) {
    console.log('Looking up profile with userId:', userId);
    const profile = await prisma.profile.findFirst({
      where: { userId: userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            isVerified: true,
            userProfile: {
              select: {
                image: true,
              },
            },
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
    // Check in User table
    const existingUser = await prisma.user.findFirst({
      where: {
        username: username,
        id: {
          not: currentUserId,
        },
      },
    });

    // Check in Profile table
    const existingProfile = await prisma.profile.findFirst({
      where: {
        username: username,
        userId: {
          not: currentUserId,
        },
      },
    });

    // Username is available only if it doesn't exist in either table
    return !existingUser && !existingProfile;
  }
  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: IUpdateProfileSchema,
    file?: Express.Multer.File,
  ) {
    console.log('UpdateProfile called with userId:', userId);
    console.log('Data received:', data);

    // Check if username is being updated and if it's available
    if (data.userName) {
      const isAvailable = await this.isUsernameAvailable(data.userName, userId);
      if (!isAvailable) {
        throw new HttpException(400, 'Username is already taken');
      }
    }

    // First, check if profile exists directly
    const profileExists = await prisma.profile.findUnique({
      where: { userId: userId },
      select: { id: true, image: true },
    });

    if (!profileExists) {
      throw new HttpException(404, 'Profile not found for this user');
    }

    console.log('Existing profile found:', profileExists);

    // Build update data - only include fields that are provided
    const updateData = {
      firstname: data.firstName,
      lastname: data.lastName,
      username: data.userName,
      image: data.image,
    };

    // Handle image update
    if (file) {
      // Delete old image file if it exists and is not empty
      if (profileExists.image && profileExists.image.trim() !== '') {
        const oldImagePath = path.join(
          __dirname,
          '../../../uploads',
          profileExists.image,
        );
        try {
          await fs.unlink(oldImagePath);
          console.log(`Old image deleted: ${profileExists.image}`);
        } catch (error) {
          console.warn(
            `Could not delete old image: ${profileExists.image}`,
            error,
          );
          // Continue with update even if old image deletion fails
        }
      }

      updateData.image = file.filename;
    } else if (data.image !== undefined) {
      // If no file but image path provided in data
      updateData.image = data.image;
    }

    console.log('Update data:', updateData);

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

  //17d4e5bd-6fba-45e6-8e97-e3b7d8eb5eef
  //24e75219-4a8b-41f3-a7c8-7ede359cdae5

  /**
   * Update financial data
   */
}

export default new ProfileService();
