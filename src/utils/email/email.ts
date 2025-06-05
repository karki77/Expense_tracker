import HttpException from '#utils/api/httpException';
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendVerificationEmail = async (
  email: string,
  verificationLink: string,
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking on the following link: ${verificationLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    throw new HttpException(200, 'Verification email sent successfully.');
  } catch (error) {
    throw new HttpException(500, 'Failed to send verification email.');
  }
};
