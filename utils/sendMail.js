import nodemailer from 'nodemailer'
import { updateEmailStatus } from './updateEmailStatus.js'
const transporter = nodemailer.createTransport({
    secure: false,
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export async function sendMail(data) {
    const cleanDate = new Date(data.timeStamp).toLocaleString('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short'
    })
    for (let i = 0; i < 3; i++) {
        try {
            await transporter.sendMail({
                from: '"Gold Invest" <debasishdas1996.dd@gmail.com>',
                to: data.email,
                subject: 'Your Gold Purchase Reciept.',
                html: `Thank you for investing! You bought ${data.quantity} of gold for ${data.price} on ${cleanDate}.`,
                attachments: [
                    {
                        filename: `receipt-${data.id}.pdf`,
                        path: `invoices/receipt-${data.id}.pdf`,
                        contentType: 'application/pdf',
                    }
                ]
            })
            updateEmailStatus(data.id, "success")
            return;
        } catch (err) {
            if (i === 2) {
                console.error("Error while sending mail:", err)
                updateEmailStatus(data.id, "failed")
                break;
            } else {
                const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
                await sleep(2000);
                console.warn("Attempt failed, retrying in 2secs.")
                continue;
            }
        }
    }


}