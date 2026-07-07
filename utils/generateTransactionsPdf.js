// pdfGenerator.js
import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import { boughtEvents } from '../events/boughtEvents.js';

export function generateTransactionsPdf(data) {
  const doc = new PDFDocument({ margin: 50 });
  fs.mkdirSync('invoices', {recursive: true})
  const writableStream = fs.createWriteStream(`invoices/receipt-${data.id}.pdf`);
  doc.pipe(writableStream);

  const startX = 50;
  const endX = 450;

  // Header
  doc.fontSize(20).font('Helvetica-Bold').text('Gold Invest - Receipt', { align: 'center' });
  doc.moveDown(1.5);

  // Metadata
  doc.fontSize(12).font('Helvetica');
  doc.text(`Transaction ID: ${data.id}`);
  doc.text(`Date: ${data.timeStamp}`);
  doc.text(`Email: ${data.email}`);
  doc.text(`Price: ${data.price}`);
  doc.text(`Quantity: ${data.quantity}`);
  doc.moveDown(2);

  // Table Headers
  doc.font('Helvetica-Bold');
  doc.text('Description', startX);
  doc.text('Amount', endX, doc.y - 12);

  // Divider Line
  doc.moveTo(startX, doc.y + 5).lineTo(endX + 50, doc.y + 5).stroke();
  doc.moveDown(1);

  // Table Rows
  doc.font('Helvetica');
  const currentY = doc.y;
  doc.text(`24 Carat Gold (${data.quantity})`, startX, currentY);
  doc.text(data.price, endX, currentY);


  // Total Section
  doc.moveDown(1);
  doc.font('Helvetica-Bold');
  doc.text(`Total: ${data.price}`, endX);
  doc.end();
  writableStream.on('finish', () => {
    boughtEvents.emit('pdf-ready', data)
  })
  return doc;
}
