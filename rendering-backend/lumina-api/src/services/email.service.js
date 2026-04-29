const nodemailer = require('nodemailer');

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
    text,
  });
};

const sendPasswordResetEmail = async (user, resetURL) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #d97706;">Lumina — Password Reset</h1>
      <p>Hi ${user.name},</p>
      <p>You requested a password reset. Click the button below to reset your password:</p>
      <a href="${resetURL}"
         style="display: inline-block; background: linear-gradient(135deg,#d97706,#ec4899);
                color: white; padding: 12px 24px; border-radius: 8px;
                text-decoration: none; margin: 20px 0;">
        Reset Password
      </a>
      <p style="color:#666;">This link expires in <strong>10 minutes</strong>.</p>
      <p style="color:#666;">If you didn't request this, ignore this email.</p>
    </div>`;

  await sendEmail({ to: user.email, subject: 'Lumina — Password Reset (expires in 10 min)', html });
};

const sendVerificationEmail = async (user, verifyURL) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #d97706;">Welcome to Lumina!</h1>
      <p>Hi ${user.name},</p>
      <p>Please verify your email address to complete your registration:</p>
      <a href="${verifyURL}"
         style="display: inline-block; background: linear-gradient(135deg,#d97706,#ec4899);
                color: white; padding: 12px 24px; border-radius: 8px;
                text-decoration: none; margin: 20px 0;">
        Verify Email
      </a>
    </div>`;

  await sendEmail({ to: user.email, subject: 'Lumina — Verify Your Email', html });
};

const sendOrderConfirmationEmail = async (user, order) => {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee;">${item.title}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">$${item.price.toFixed(2)}</td>
      </tr>`
    )
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #d97706;">Order Confirmed! 🎉</h1>
      <p>Hi ${user.name}, your order <strong>${order.orderNumber}</strong> has been placed.</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <thead>
          <tr style="background:#f9f9f9;">
            <th style="padding:8px;text-align:left;">Item</th>
            <th style="padding:8px;text-align:center;">Qty</th>
            <th style="padding:8px;text-align:right;">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:8px;font-weight:bold;">Total</td>
            <td style="padding:8px;text-align:right;font-weight:bold;">$${order.totalAmount.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      <p>We'll notify you when your order ships. Thank you for shopping with Lumina!</p>
    </div>`;

  await sendEmail({ to: user.email, subject: `Lumina — Order ${order.orderNumber} Confirmed`, html });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendOrderConfirmationEmail,
};
