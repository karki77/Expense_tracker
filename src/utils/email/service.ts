import nodemailer from 'nodemailer';
import { IEmailSend } from './types';

export const sendEmail = async (payload: IEmailSend) => {
  console.log('Sending email to:');
  try {
    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 587,
      secure: false, // true for 465, false for other ports

      auth: {
        user: '3cac6fe40e5bba', // generated ethereal user
        pass: '69fd33c9d9a55b', // NOT your Gmail password!  // please generate own app password via gmail 
      },
    });

    const mailOptions = {
      from: 'courseplatform.noreply@gmail.com',
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
