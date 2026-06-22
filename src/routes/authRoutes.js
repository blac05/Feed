import express from "express";
import auth from "../middleware/auth.js";
import {
  register, login,
  verifyEmail, resendVerification,
  forgotPassword, resetPassword, changePassword,
  initiate2FA, verify2FA, disable2FA, get2FAStatus,
} from "../controllers/authController.js";

const router = express.Router();

// Auth
router.post("/register", register);
router.post("/login", login);

// Email verification
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", auth, resendVerification);

// Password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/change-password", auth, changePassword);

// 2FA
router.get("/2fa/status", auth, get2FAStatus);
router.post("/2fa/initiate", auth, initiate2FA);
router.post("/2fa/verify", auth, verify2FA);
router.post("/2fa/disable", auth, disable2FA);

export default router;
