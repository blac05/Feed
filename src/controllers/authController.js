import crypto from "crypto";
import bcrypt from "bcryptjs";
import { authenticator } from "otplib"; // Fixed: Direct named import for ESM compliance
import qrcode from "qrcode"; 
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { registerUser } from "../services/authService.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from "../services/emailService.js";

// ── Register ──────────────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    const { username, name, email, password, accountType } = req.body;
    const user = await registerUser(username, name, email, password, accountType);

    const token = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = token;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await sendVerificationEmail(user.email, token, user.name || user.username);

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ── Login ─────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password, twoFactorToken } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase().trim() });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: `Account banned: ${user.banReason || "Community guidelines violation"}` });
    }

    // 2FA check
    if (user.twoFactorEnabled) {
      if (!twoFactorToken) {
        return res.status(202).json({
          requires2FA: true,
          message: "Two-factor authentication token required",
        });
      }
      const isValid = authenticator.verify({
        token: twoFactorToken,
        secret: user.twoFactorSecret,
      });
      if (!isValid) {
        return res.status(401).json({ message: "Invalid 2FA token" });
      }
    }

    // Update last seen
    user.lastSeen = new Date();
    await user.save();

    res.json({
      success: true,
      token: generateToken(user._id),
      user: { ...user.toObject(), password: undefined },
    });
  } catch (error) {
    next(error);
  }
};

// ── Email Verification ────────────────────────────────────
export const verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      emailVerificationToken: req.params.token,
      emailVerificationExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired verification link" });

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name || user.username);
    res.json({ success: true, message: "Email verified successfully!" });
  } catch (error) {
    next(error);
  }
};

export const resendVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.emailVerified) return res.status(400).json({ message: "Email already verified" });

    const token = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = token;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await sendVerificationEmail(user.email, token, user.name || user.username);
    res.json({ success: true, message: "Verification email sent!" });
  } catch (error) {
    next(error);
  }
};

// ── Password ──────────────────────────────────────────────
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email?.toLowerCase().trim() });
    if (!user) return res.json({ success: true, message: "If that email exists, a reset link has been sent." });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    await sendPasswordResetEmail(user.email, token, user.name || user.username);
    res.json({ success: true, message: "Password reset email sent!" });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired reset link" });

    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful!" });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both fields are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ success: true, message: "Password changed successfully!" });
  } catch (error) {
    next(error);
  }
};

// ── Two-Factor Authentication ─────────────────────────────
export const initiate2FA = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate a new TOTP secret
    const secret = authenticator.generateSecret();
    user.twoFactorTempSecret = secret;
    await user.save();

    const appName = "Feed";
    const otpauthUrl = authenticator.keyuri(user.email, appName, secret);

    // Generate QR code as data URL
    const qrDataUrl = await qrcode.toDataURL(otpauthUrl);

    res.json({
      success: true,
      secret,
      otpauthUrl,
      qrDataUrl,
    });
  } catch (error) {
    next(error);
  }
};

export const verify2FA = async (req, res, next) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.twoFactorTempSecret) {
      return res.status(400).json({ message: "Please initiate 2FA setup first" });
    }

    const isValid = authenticator.verify({
      token,
      secret: user.twoFactorTempSecret,
    });

    if (!isValid) {
      return res.status(400).json({ message: "Invalid verification code. Check your authenticator app." });
    }

    // Activate 2FA
    user.twoFactorSecret = user.twoFactorTempSecret;
    user.twoFactorTempSecret = "";
    user.twoFactorEnabled = true;
    await user.save();

    res.json({
      success: true,
      message: "Two-factor authentication enabled! 🛡️",
      twoFactorEnabled: true,
    });
  } catch (error) {
    next(error);
  }
};

export const disable2FA = async (req, res, next) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ message: "2FA is not enabled" });
    }

    const isValid = authenticator.verify({ token, secret: user.twoFactorSecret });
    if (!isValid) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = "";
    user.twoFactorTempSecret = "";
    await user.save();

    res.json({ success: true, message: "Two-factor authentication disabled" });
  } catch (error) {
    next(error);
  }
};

export const get2FAStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("twoFactorEnabled");
    res.json({ success: true, twoFactorEnabled: user?.twoFactorEnabled || false });
  } catch (error) {
    next(error);
  }
};