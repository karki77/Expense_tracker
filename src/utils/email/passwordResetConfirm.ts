import { sendEmail } from './service';

export const sendPasswordResetConfirmationEmail = async (
  email: string,
  username: string,
) => {
  await sendEmail({
    to: email,
    subject: 'Password Reset Confirmation',
    text: `Hello ${username}, your password has been reset successfully`,
    html: `<p>Hello ${username},</p><p>Your password has been reset successfully.</p>`,
  });
};
