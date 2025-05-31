const nodemailer = require('nodemailer');
require('dotenv').config();

export const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: Number(process.env.MAILTRAP_PORT),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

/**
 * Send an email using the configured Nodemailer transporter.
 * @param to Recipient email address
 * @param subject Email subject
 * @param html HTML body
 * @param text Plain text body
 */
export async function sendMail(to: string, subject: string, html: string, text: string) {
  const from = process.env.MAILTRAP_SENDER_EMAIL;
  try {
    const info = await transporter.sendMail({
      from: from,
      to,
      subject,
      html,
      text,
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}


export async function sendApprovedEmail(to: string) {
  const subject = 'Your Order is Confirmed ✅';
  const html = '<p>Thank you! Your order has been approved and is now being processed.</p>';
  const text = 'Thank you! Your order has been approved and is now being processed.';
  return sendMail(to, subject, html, text);
}

export async function sendFailedEmail(to: string) {
  const subject = 'Order Payment Failed ❌';
  const html = '<p>Unfortunately, your payment did not go through. Please try again or use a different method.</p>';
  const text = 'Unfortunately, your payment did not go through. Please try again or use a different method.';
  return sendMail(to, subject, html, text);
}

export async function sendDeclinedEmail(to: string) {
  const subject = 'Order Declined 🚫';
  const html = '<p>We couldn’t approve your order. Please contact support if you believe this is a mistake.</p>';
  const text = 'We couldn’t approve your order. Please contact support if you believe this is a mistake.';
  return sendMail(to, subject, html, text);
}


