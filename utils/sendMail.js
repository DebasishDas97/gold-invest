import nodemailer from 'nodemailer';
import { updateEmailStatus } from './updateEmailStatus.js';

// 1️⃣ Configure the Brevo SMTP Transporter
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

export async function sendMail(data) {
  const cleanDate = new Date(data.timeStamp).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const mailOptions = {
    from: `"Gold Invest" <${process.env.BREVO_SENDER}>`,
    to: data.email,
    subject: `Your Gold Purchase Receipt – ${cleanDate}`,
    html: `<p>Thank you for investing! You bought <b>${data.quantity}g</b> of gold for <b>$${data.price}</b> on ${cleanDate}.</p>`,
    attachments: [
      {
        filename: `receipt-${data.id}.pdf`,
        path: `invoices/receipt-${data.id}.pdf`,
        contentType: 'application/pdf',
      },
    ],
  };

  try {
    // 2️⃣ Send via Brevo SMTP Relay
    await transporter.sendMail(mailOptions);
    await updateEmailStatus(data.id, 'success');
  } catch (err) {
    console.error('Brevo email sending failed:', err);
    await updateEmailStatus(data.id, 'failed');
  }
}
