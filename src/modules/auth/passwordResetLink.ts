export const generatePasswordResetLink = (token: string): string => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:7000';
  return `${baseUrl}/api/v2/auth/reset-password?token=${token}`;
};
