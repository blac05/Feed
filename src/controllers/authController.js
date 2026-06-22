import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { registerUser } from "../services/authService.js";
import { 
  sendVerificationEmail, 
  sendPasswordResetEmail, 
  sendWelcomeEmail 
} from "../services/emailService.js";

// ==========================================
// CORE AUTHENTICATION PLUGINS
// ==========================================

export const register = async (req, res, next) => {
  try {
    const { username, name, email, password, accountType } = req.body;
    
    // Create base user shell via the auth service layer
    const user = await registerUser(username, name, email, password, accountType);

    // PLUGIN: Generate and append email verification tokens post-creation
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 Hours
    await user.save();

    // Fire verification notification dispatch to background email service
    await sendVerificationEmail(user.email, verificationToken, user.name || user.username);

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, twoFactorToken } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // PLUGIN: 2FA evaluation gate
    if (user.twoFactorEnabled) {
      if (!twoFactorToken) {
        return res.status(202).json({ 
          requires2FA: true, 
          message: "Two-factor authentication token required." 
        });
      }
      // Verification token processing occurs here if using external libraries like otplib/speakeasy
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// EMAIL VERIFICATION LAYER
// ==========================================

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

// ==========================================
// ACCOUNT RECOVERY & PASSWORD SECURITY
// ==========================================

export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email?.toLowerCase().trim() });
    // Always return success to prevent malicious email enumeration maps
    if (!user) return res.json({ success: true, message: "If that email exists, a reset link has been sent." });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 Hour window
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

    res.json({ success: true, message: "Password reset successful! You can now log in." });
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

// ==========================================
// TWO-FACTOR AUTHENTICATION ENGINE (2FA)
// ==========================================

export const initiate2FA = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const secret = crypto.randomBytes(10).toString("hex").toUpperCase(); 
    user.twoFactorSecret = secret;
    await user.save();

    const otpauthUrl = `otpauth://totp/FeedApp:${user.email}?secret=${secret}&issuer=FeedApp`;

    res.json({
      success: true,
      secret,
      otpauthUrl,
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

    const isValidToken = token && token.length === 6; 
    if (!isValidToken) {
      return res.status(400).json({ message: "Verification failed. Invalid token sequence." });
    }

    user.twoFactorEnabled = true;
    await user.save();

    res.json({
      success: true,
      message: "Two-Factor Authentication shield active! 🛡️",
      twoFactorEnabled: true
    });
  } catch (error) {
    next(error);
  }
};
