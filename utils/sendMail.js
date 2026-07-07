import fs from 'node:fs/promises';
import path from 'node:path';
import { updateEmailStatus } from './updateEmailStatus.js';

export async function sendMail(data) {
  const cleanDate = new Date(data.timeStamp).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  try {
    const filePath = path.join(import.meta.dirname, '..', 'invoices', `receipt-${data.id}.pdf`);
    const pdfBuffer = await fs.readFile(filePath);
    const base64Pdf = pdfBuffer.toString('base64');

    // Use BREVO_API_KEY if available, otherwise fall back to BREVO_SMTP_KEY
    const apiKey = process.env.BREVO_API_KEY || process.env.BREVO_SMTP_KEY;

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Gold Invest',
          email: process.env.BREVO_SENDER,
        },
        to: [
          {
            email: data.email,
          },
        ],
        subject: `Your Gold Purchase Receipt – ${cleanDate}`,
        htmlContent: `<p>Thank you for investing! You bought <b>${data.quantity}g</b> of gold for <b>$${data.price}</b> on ${cleanDate}.</p>`,
        attachment: [
          {
            name: `receipt-${data.id}.pdf`,
            content: base64Pdf,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Brevo API Error (${response.status}): ${errorData}`);
    }

    console.log(`Email successfully sent to ${data.email} via Brevo HTTP API!`);
    await updateEmailStatus(data.id, 'success');
  } catch (err) {
    console.error('Brevo email sending failed:', err);
    await updateEmailStatus(data.id, 'failed');
  }
}
