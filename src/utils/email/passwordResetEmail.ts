import { sendEmail } from './service';

export const sendPasswordResetEmail = async (
  email: string,
  username: string,
  resetLink: string,
) => {
  await sendEmail({
    to: email,
    subject: 'Password Reset',
    text: `Hello ${username}, please reset your password by clicking on the following link: ${resetLink}`,
    html: `<p>Hello ${username},</p><p>Please reset your password by clicking on the following link: <a href="${resetLink}">Reset Password</a></p>`,
  });
};
