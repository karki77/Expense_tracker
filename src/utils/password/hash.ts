import argon2 from 'argon2';
import HttpException from '../../utils/api/httpException';

export const hashPassword = async (password: string) => {
  try {
    const hashedPassword = await argon2.hash(password);
    return hashedPassword;
  } catch (error) {
    throw new HttpException(400, 'Error hashed password');
  }
};

export const verifyPassword = async (
  hashedPassword: string,
  password: string,
): Promise<boolean> => {
  try {
    return await argon2.verify(hashedPassword, password);
  } catch {
    throw new HttpException(400, 'Error verifying password');
  }
};
