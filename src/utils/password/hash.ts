import argon2 from 'argon2';

export const hashPassword = async (password: string) => {
  try {
    const hashedPassword = await argon2.hash(password);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

export const verifyPassword = async (
  hashPassword: string,
  password: string,
) => {
  try {
    const isPasswordValid = await argon2.verify(hashPassword, password);
    return isPasswordValid;
  } catch (error) {
    throw new Error('Error verifying password');
  }
};
