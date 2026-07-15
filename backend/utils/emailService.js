import nodemailer from "nodemailer";

/**
 * Create Nodemailer transporter from env config.
 * Falls back to Ethereal-style console logging when credentials are placeholders.
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send a password-reset email with the reset link.
 * Template function for Nodemailer execution.
 */
export const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || "WardTech <noreply@wardtech.local>",
    to,
    subject: "WardTech — Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a365d;">WardTech Password Reset</h2>
        <p>Hello ${name || "User"},</p>
        <p>You requested a password reset for your WardTech account.</p>
        <p>Click the button below to reset your password. This link expires in <strong>15 minutes</strong>.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}"
             style="background:#1a365d;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;">
            Reset Password
          </a>
        </p>
        <p>Or copy this link into your browser:</p>
        <p style="word-break: break-all; color: #4a5568;">${resetUrl}</p>
        <p>If you did not request this, please ignore this email.</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
        <p style="color:#718096;font-size:12px;">WardTech Digital Ward Application</p>
      </div>
    `,
    text: `Hello ${name || "User"},\n\nReset your WardTech password using this link (expires in 15 minutes):\n${resetUrl}\n\nIf you did not request this, ignore this email.`,
  };

  // If email credentials look like placeholders, log instead of sending
  const user = process.env.EMAIL_USER || "";
  if (!user || user.includes("your_email")) {
    console.log("[Email Mock] Password reset email:");
    console.log(`  To: ${to}`);
    console.log(`  Reset URL: ${resetUrl}`);
    return { mocked: true };
  }

  const transporter = createTransporter();
  const info = await transporter.sendMail(mailOptions);
  return { mocked: false, messageId: info.messageId };
};

export default { sendPasswordResetEmail };
