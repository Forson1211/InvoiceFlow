import nodemailer from "nodemailer";
import { formatCurrency, formatDate } from "./utils";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

const baseStyles = `
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 40px; }
    .header h1 { color: #fff; margin: 0; font-size: 24px; font-weight: 700; }
    .header p { color: #94a3b8; margin: 4px 0 0; font-size: 14px; }
    .body { padding: 32px 40px; }
    .amount-box { background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
    .amount-box .label { color: rgba(255,255,255,0.8); font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; }
    .amount-box .amount { color: #fff; font-size: 36px; font-weight: 800; margin: 8px 0 0; }
    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #94a3b8; font-size: 13px; }
    .info-value { color: #1e293b; font-size: 13px; font-weight: 600; }
    .btn { display: inline-block; background: #6366f1; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 24px 0 0; }
    .footer { background: #f8fafc; padding: 20px 40px; text-align: center; color: #94a3b8; font-size: 12px; }
  </style>
`;

export async function sendInvoiceEmail(opts: {
  to: string;
  clientName: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  dueDate: Date | string;
  viewUrl: string;
  fromName: string;
}) {
  const html = `
    <!DOCTYPE html><html><head>${baseStyles}</head><body>
    <div class="container">
      <div class="header">
        <h1>InvoiceGlow</h1>
        <p>Professional Invoicing</p>
      </div>
      <div class="body">
        <p style="color:#1e293b;font-size:16px;">Hi <strong>${opts.clientName}</strong>,</p>
        <p style="color:#64748b;font-size:14px;line-height:1.6;">
          You have received a new invoice from <strong>${opts.fromName}</strong>. 
          Please review the details below and make payment by the due date.
        </p>
        <div class="amount-box">
          <div class="label">Amount Due</div>
          <div class="amount">${formatCurrency(opts.amount, opts.currency)}</div>
        </div>
        <div class="info-row">
          <span class="info-label">Invoice Number</span>
          <span class="info-value">#${opts.invoiceNumber}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Due Date</span>
          <span class="info-value">${formatDate(opts.dueDate)}</span>
        </div>
        <div style="text-align:center;">
          <a href="${opts.viewUrl}" class="btn">View & Pay Invoice →</a>
        </div>
      </div>
      <div class="footer">
        <p>This invoice was sent via InvoiceGlow · <a href="https://invoiceglow.app">invoiceglow.app</a></p>
        <p style="margin-top:4px;">© ${new Date().getFullYear()} InvoiceGlow. All rights reserved.</p>
      </div>
    </div>
    </body></html>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: opts.to,
    subject: `Invoice #${opts.invoiceNumber} from ${opts.fromName} — ${formatCurrency(opts.amount, opts.currency)} due ${formatDate(opts.dueDate)}`,
    html,
  });
}

export async function sendPaymentConfirmationEmail(opts: {
  to: string;
  clientName: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  fromName: string;
}) {
  const html = `
    <!DOCTYPE html><html><head>${baseStyles}</head><body>
    <div class="container">
      <div class="header">
        <h1>InvoiceGlow</h1>
        <p>Payment Confirmed 🎉</p>
      </div>
      <div class="body">
        <p style="color:#1e293b;font-size:16px;">Hi <strong>${opts.clientName}</strong>,</p>
        <p style="color:#64748b;font-size:14px;line-height:1.6;">
          Your payment has been received and confirmed. Thank you!
        </p>
        <div class="amount-box" style="background: linear-gradient(135deg, #10b981, #059669);">
          <div class="label">Payment Received</div>
          <div class="amount">${formatCurrency(opts.amount, opts.currency)}</div>
        </div>
        <div class="info-row">
          <span class="info-label">Invoice Number</span>
          <span class="info-value">#${opts.invoiceNumber}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Status</span>
          <span class="info-value" style="color:#10b981;">✓ Paid</span>
        </div>
      </div>
      <div class="footer">
        <p>Powered by InvoiceGlow · <a href="https://invoiceglow.app">invoiceglow.app</a></p>
      </div>
    </div>
    </body></html>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: opts.to,
    subject: `Payment Received — Invoice #${opts.invoiceNumber} from ${opts.fromName}`,
    html,
  });
}
