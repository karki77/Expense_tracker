import { IRegisterUserSchema } from './validation';
import HttpException from '#utils/api/httpException';
import { generateToken } from '../../middleware/authMiddleware';
import { hashPassword, verifyPassword } from '#utils/password/hash';
import { randomBytes } from 'crypto';
import { prisma } from '../../config/setup/dbSetup';
/**
 * Register a new user
 */
class UserService {
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
        username: data.username,
        email: data.email,
        password: hashedPassword,
        verificationToken: verificationToken,
        verificationTokenExpires: verificationTokenExpires,
      },
    });
  }
}
