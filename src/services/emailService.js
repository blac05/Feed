import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const baseStyle = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;
`;
const cardStyle = `
  background: white; border-radius: 16px; padding: 32px; margin: 16px 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;
const btnStyle = `
  display: inline-block; background: linear-gradient(135deg, #0ea5e9, #2563eb);
  color: white; padding: 14px 28px; border-radius: 12px;
  text-decoration: none; font-weight: bold; font-size: 15px; margin: 20px 0;
`;

export const sendVerificationEmail = async (email, token, name) => {
  const url = `${process.env.FRONTEND_URL || "https://feed-frontend-eight.vercel.app"}/verify-email/${token}`;
  try {
    await transporter.sendMail({
      from: `"Feed" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your Feed account ✉️",
      html: `
        <div style="${baseStyle}">
          <h2 style="color:#2563eb;text-align:center;font-size:28px;margin:0 0 8px">Feed</h2>
          <p style="text-align:center;color:#6b7280;margin:0 0 24px">Connect. Share. Discover.</p>
          <div style="${cardStyle}">
            <h3 style="color:#111827;margin:0 0 12px">Welcome to Feed, ${name || "there"}! 🎉</h3>
            <p style="color:#6b7280;line-height:1.6">
              Thanks for signing up. Please verify your email address to activate your account and start posting.
            </p>
            <div style="text-align:center">
              <a href="${url}" style="${btnStyle}">Verify My Email</a>
            </div>
            <p style="color:#9ca3af;font-size:12px;margin:16px 0 0">
              This link expires in 24 hours. If you didn't create a Feed account, ignore this email.
            </p>
          </div>
        </div>
      `,
    });
  } catch (e) {
    console.error("Email send error:", e.message);
  }
};

export const sendPasswordResetEmail = async (email, token, name) => {
  const url = `${process.env.FRONTEND_URL || "https://feed-frontend-eight.vercel.app"}/reset-password/${token}`;
  try {
    await transporter.sendMail({
      from: `"Feed" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your Feed password 🔑",
      html: `
        <div style="${baseStyle}">
          <h2 style="color:#2563eb;text-align:center;font-size:28px;margin:0 0 8px">Feed</h2>
          <p style="text-align:center;color:#6b7280;margin:0 0 24px">Password Reset</p>
          <div style="${cardStyle}">
            <h3 style="color:#111827;margin:0 0 12px">Hi ${name || "there"},</h3>
            <p style="color:#6b7280;line-height:1.6">
              You requested to reset your password. Click the button below to set a new one.
            </p>
            <div style="text-align:center">
              <a href="${url}" style="${btnStyle}">Reset Password</a>
            </div>
            <p style="color:#9ca3af;font-size:12px;margin:16px 0 0">
              This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
    });
  } catch (e) {
    console.error("Email send error:", e.message);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: `"Feed" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "You're all set on Feed! 🚀",
      html: `
        <div style="${baseStyle}">
          <div style="${cardStyle}">
            <h3 style="color:#111827">You're verified, ${name || "there"}! 🎉</h3>
            <p style="color:#6b7280;line-height:1.6">
              Your Feed account is now fully active. Start posting, following people, and going live!
            </p>
            <div style="text-align:center">
              <a href="${process.env.FRONTEND_URL || "https://feed-frontend-eight.vercel.app"}/home" style="${btnStyle}">
                Open Feed
              </a>
            </div>
          </div>
        </div>
      `,
    });
  } catch (e) {
    console.error("Email send error:", e.message);
  }
};
