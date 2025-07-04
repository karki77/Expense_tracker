import { IUpdateProfileSchema } from './validation';
import { prisma } from '../../config/setup/dbSetup';
import HttpException from '../../utils/api/httpException';
import { imageHandler } from '../../utils/imageHandler/imageHandler';
import { IPaginationSchema } from '#utils/validators/commonValidation';
import { pagination, getPageDocs } from '../../utils/pagination/pagination';
class ProfileService {
  /**
   * Get profile by user ID
   */
  async getUserProfile(userId: string) {
    const profile = await prisma.profile.findFirst({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            username: true,
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
    const financialSummary = await this.generateFinancialSummary(userId);

    return {
      user: profile.user,
      financialSummary,
    };
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

    //handle profile image update
    const updatedImageFilename = await imageHandler.updateProfileImage(
      file,
      profileExists.image,
    );

    // Build update data - only include fields that are provided
    const updateData = {
      firstname: data.firstName,
      lastname: data.lastName,
      username: data.userName,
      image:
        updatedImageFilename !== undefined ? updatedImageFilename : data.image,
    };

    console.log('update data:', updateData);

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
   * generate user financial summary
   */
  async generateFinancialSummary(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [expensetTotal, incomeTotal, monthlyExpense, monthlyIncome] =
      await Promise.all([
        prisma.expense.aggregate({
          _sum: { amount: true },
          where: { userId },
        }),
        prisma.income.aggregate({
          _sum: { amount: true },
          where: { userId },
        }),
        prisma.expense.aggregate({
          _sum: { amount: true },
          where: { userId, createdAt: { gte: startOfMonth } },
        }),
        prisma.income.aggregate({
          _sum: { amount: true },
          where: { userId, createdAt: { gte: startOfMonth } },
        }),
      ]);
    const totalIncomes = incomeTotal._sum.amount ?? 0;
    const totalExpenses = expensetTotal._sum.amount ?? 0;
    const monthlyIncomes = monthlyIncome._sum.amount ?? 0;
    const monthlyExpenses = monthlyExpense._sum.amount ?? 0;
    return {
      userId,
      totalIncomes,
      totalExpenses,
      currentBalance: totalIncomes - totalExpenses,
      monthlyIncomes,
      monthlyExpenses,
      monthlyBalance: monthlyIncomes - monthlyExpenses,
      isOVerBudget: monthlyExpenses > monthlyIncomes,
      isOnBudget: monthlyExpenses === monthlyIncomes,
      isUnderBudget: monthlyExpenses < monthlyIncomes,
    };
  }
  /*
   * get top expenses
   */
  async getTopExpenses(userId: string, query: IPaginationSchema) {
    const { limit, skip, page } = pagination({
      limit: query.limit,
      page: query.page,
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Execute queries
    const [topExpenses, totalCount] = await Promise.all([
      prisma.expense.findMany({
        where: {
          userId,
          date: { lte: startOfMonth },
        },
        orderBy: {
          amount: 'desc',
        },
        take: limit,
        skip,
        select: {
          id: true,
          name: true,
          amount: true,
          date: true,
          category: true,
        },
      }),
      prisma.expense.count({
        where: {
          userId,
          date: { lte: startOfMonth },
        },
      }),
    ]);
    // Generate pagination docs
    const paginationDocs = getPageDocs({
      page: page,
      limit: limit,
      count: totalCount,
    });

    //
    return {
      topExpenses,
      pagination: paginationDocs,
    };
  }
}

export default new ProfileService();
