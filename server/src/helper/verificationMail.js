import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendVerificationMail = async (email, code) => {
  try {
    const info = await transporter.sendMail({
      from: '"MediLink" <' + process.env.EMAIL_USER + '>',
      to: email,
      subject: 'Verify Your MediLink Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Verify Your Email</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
              Thank you for signing up with MediLink! Please use the following verification code to complete your registration:
            </p>
            <div style="background-color: #eff6ff; border-radius: 6px; padding: 20px; margin: 25px 0; text-align: center;">
              <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px;">${code}</span>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              This code will expire in <strong>10 minutes</strong>.
            </p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              If you didn't request this verification code, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              © 2025 MediLink. All rights reserved.
            </p>
          </div>
        </div>
      `
    });

    console.log("Verification email sent successfully:", info.messageId);
    return { success: true, info };
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};