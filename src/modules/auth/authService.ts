import {
  IRegisterUserSchema,
  IVerifyEmailQuerySchema,
  ILoginUserSchema,
} from './validation';
import HttpException from '../../utils/api/httpException';
import { generateVerificationLink } from '../../utils/email/linkGenerator';
import { sendVerificationEmail } from '../../utils/email/verificationEmail';
import { generateToken } from '../../middleware/authMiddleware';
import { hashPassword, verifyPassword } from '../../utils/password/hash';
import { randomBytes } from 'crypto';
import { prisma } from '../../config/setup/dbSetup';
/**
 * Register a new user
 */
class AuthService {
  async registerUser(data: IRegisterUserSchema) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });
    if (existingUser) {
      throw new HttpException(400, 'User already exists');
    }
    const verificationToken = randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    const hashedPassword = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        username: data.username,
        email: data.email,
        password: hashedPassword,
        verificationToken: verificationToken,
        verificationTokenExpires: verificationTokenExpires,
        userProfile: {
          create: {
            firstname: data.firstname,
            lastname: data.lastname,
            username: data.username,
            image: ' ',
            totalExpenses: 0,
            totalBudget: 0,
            currentBalance: 0,
            monthlyExpenses: 0,
            monthlyBudget: 0,
            isOverBudget: false,
            isUnderBudget: false,
            isOnBudget: false,
          },
        },
      },
    });
    //Update verification link to use token
    //const verificationLink = `http://localhost:7000/api/v2/user/verify-email?token=${verificationToken}`;
    const verificationLink = generateVerificationLink(verificationToken);
    await sendVerificationEmail(user.email, user.username, verificationLink);
    return user;
  }
  async verifyEmail(query: IVerifyEmailQuerySchema) {
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: query.token,
        verificationTokenExpires: {
          gte: new Date(), //token is still valid not expired
        },
      },
    });
    if (!user) {
      throw new HttpException(400, 'Invalid or expired verification token.');
    }
    if (user.isVerified) {
      throw new HttpException(400, 'Email already verified');
    }
    //Update user to set the email is verified
    //clear the verification code
    //clear token expiration date
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });
  }

  /**
   * Login User
   */
  async loginUser(data: ILoginUserSchema) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      throw new HttpException(400, 'Invalid email or password');
    }
    const isPasswordValid = await verifyPassword({
      hashedPassword: user.password,
      password: data.password,
    });
    if (!isPasswordValid) {
      throw new HttpException(401, 'Invalid email or password');
    }
    const { accessToken, refreshToken } = generateToken(user);
    return {
      user: {
        id: user.id,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }
}

export default new AuthService();
