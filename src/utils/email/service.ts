import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

import type { IEmailSend } from './types';

export const sendEmail = async (payload: IEmailSend) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const mailOptions = {
      from: 'expensetracker1029@gmail.com',
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    };

    const data = await transporter.sendMail(mailOptions);

    console.log('Email sent:', data.response);
    return data;
  } catch (err) {
    console.error('Error sending email:', err);
    throw new Error('Failed to send email');
  }
};
