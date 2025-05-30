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

/**
 * Send a test email to verify the mailer configuration.
 */
export async function sendTestEmail() {
    const to = "fazlul0127@gmail.com";
    const subject = 'Test Email from Your Store';
    const html = '<p>This is a test email sent from Your Store.</p>';
    const text = 'This is a test email sent from Your Store.';
    return sendMail(to, subject, html, text);
}

sendTestEmail()
  .then(() => console.log('Test email sent successfully'))
  .catch((error) => console.error('Error sending test email:', error));
