import { sendEmail } from './service';

export const sendVerificationEmail = async (
  email: string,
  username: string,
  verificationLink: string,
) => {
  await sendEmail({
    to: email,
    subject: 'Email Verification',
    text: `Hello ${username}, please verify your email by clicking on the following link: ${verificationLink}`,
    html: `<h1>Email Verification</h1><p>Hello ${username}, please verify your email by clicking on the following link: <a href="${verificationLink}">Verify Email</a></p>`,
  });
};
