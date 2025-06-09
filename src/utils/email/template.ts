// services/email.templates.ts
import { sendEmail } from './service';
import { generateVerificationLink } from './linkGenerator';
import type { User } from '@prisma/client'; // Or your custom user type

export const sendVerificationEmail = (user: User, token: string) => {
  const link = generateVerificationLink(token);
  return sendEmail({
    to: user.email,
    subject: 'Email Verification',
    text: `Hello ${user.username}, verify your email here: ${link}`,
    html: `<h1>Email Verification</h1><p>Hello ${user.username}, please verify your email by clicking on the following link: <a href="${link}">Verify Email</a></p>`,
  });
};
