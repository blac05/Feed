import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const FRONTEND_BASE_URL = process.env.FRONTEND_URL || "https://feed-frontend-eight.vercel.app";

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

// Helper styling for email-safe dashboard metric blocks
const metricCardStyle = `
  display: inline-block; width: 47%; background: #eff6ff; border-radius: 12px; 
  padding: 16px; margin: 4px; text-align: center; box-sizing: border-box; vertical-align: top;
`;

// ── Auth & Onboarding Emails ────────────────────────────────

export const sendVerificationEmail = async (email, token, name) => {
  const url = `${FRONTEND_BASE_URL}/verify-email/${token}`;
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
  const url = `${FRONTEND_BASE_URL}/reset-password/${token}`;
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
              <a href="${FRONTEND_BASE_URL}/home" style="${btnStyle}">
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

// ── Engagement & Retention Emails ───────────────────────────

export const sendWeeklyDigest = async (email, name, data) => {
  const {
    newFollowers = 0,
    totalLikes = 0,
    totalComments = 0,
    coinEarnings = 0,
    topPosts = [],
    weeklyKarma = 0,
  } = data;

  try {
    await transporter.sendMail({
      from: `"Feed Weekly" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Feed week in review 📊`,
      html: `
        <div style="${baseStyle}">
          <h2 style="color:#2563eb;text-align:center;font-size:28px;margin:0 0 4px">Feed</h2>
          <p style="text-align:center;color:#6b7280;margin:0 0 24px">Your weekly digest</p>

          <div style="${cardStyle}">
            <h3 style="color:#111827;margin:0 0 16px">Hey ${name || "there"} 👋</h3>
            <p style="color:#6b7280;margin:0 0 20px">Here's what happened on your Feed this week:</p>

            <div style="text-align:center; margin:20px 0;">
              <div style="${metricCardStyle} background:#eff6ff;">
                <p style="margin:0;font-size:28px;font-weight:900;color:#2563eb">${newFollowers}</p>
                <p style="margin:4px 0 0;color:#6b7280;font-size:13px">New Followers</p>
              </div>
              <div style="${metricCardStyle} background:#fef3c7;">
                <p style="margin:0;font-size:28px;font-weight:900;color:#d97706">${weeklyKarma}</p>
                <p style="margin:4px 0 0;color:#6b7280;font-size:13px">Karma Earned</p>
              </div>
              <div style="${metricCardStyle} background:#fdf2f8;">
                <p style="margin:0;font-size:28px;font-weight:900;color:#db2777">${totalLikes}</p>
                <p style="margin:4px 0 0;color:#6b7280;font-size:13px">Total Likes</p>
              </div>
              <div style="${metricCardStyle} background:#f0fdf4;">
                <p style="margin:0;font-size:28px;font-weight:900;color:#16a34a">${coinEarnings}🪙</p>
                <p style="margin:4px 0 0;color:#6b7280;font-size:13px">Coins Earned</p>
              </div>
            </div>

            ${topPosts.length > 0 ? `
              <h4 style="color:#111827;margin:20px 0 12px">🔥 Your top posts this week</h4>
              ${topPosts.slice(0, 3).map((p, i) => `
                <div style="border:1px solid #e5e7eb;border-radius:12px;padding:12px;margin-bottom:8px;background:#ffffff;">
                  <p style="margin:0 0 6px;color:#374151;font-size:14px;line-height:1.4">${p.content?.slice(0, 120)}${p.content?.length > 120 ? "..." : ""}</p>
                  <p style="margin:0;color:#9ca3af;font-size:12px">❤️ ${p.likes?.length || 0} likes · 💬 ${p.comments?.length || 0} comments</p>
                </div>
              `).join("")}
            ` : ""}

            <div style="text-align:center;margin-top:24px">
              <a href="${FRONTEND_BASE_URL}/home" style="${btnStyle}">
                Open Feed 🚀
              </a>
            </div>
          </div>

          <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px">
            You're receiving this because you have email digests enabled.
            <a href="${FRONTEND_BASE_URL}/settings" style="color:#9ca3af">Unsubscribe</a>
          </p>
        </div>
      `,
    });
  } catch (e) {
    console.error("Digest email error:", e.message);
  }
};

export const sendReferralRewardEmail = async (email, name, coinsEarned, referredUsername) => {
  try {
    await transporter.sendMail({
      from: `"Feed" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `You earned ${coinsEarned} coins from your referral! 🎉`,
      html: `
        <div style="${baseStyle}">
          <div style="${cardStyle}">
            <h3 style="color:#111827">Referral reward! 🪙</h3>
            <p style="color:#6b7280;line-height:1.6">
              <strong>@${referredUsername}</strong> just joined Feed using your referral link and you earned
              <strong style="color:#d97706">${coinsEarned} coins!</strong>
            </p>
            <div style="text-align:center">
              <a href="${FRONTEND_BASE_URL}/wallet" style="${btnStyle}">View Wallet</a>
            </div>
          </div>
        </div>
      `,
    });
  } catch (e) {
    console.error("Referral email error:", e.message);
  }
};
