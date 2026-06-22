import express from "express";
import {
  register,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  changePassword,
  initiate2FA,
  verify2FA,
} from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// ==========================================
// CORE AUTH ROUTINES
// ==========================================
router.post("/register", register);
router.post("/login", login);

// ==========================================
// EMAIL VERIFICATION & RECOVERY
// ==========================================
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", auth, resendVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/change-password", auth, changePassword);

// ==========================================
// TWO-FACTOR AUTHENTICATION ENGINE (2FA)
// ==========================================
router.post("/2fa/initiate", auth, initiate2FA);
router.post("/2fa/verify", auth, verify2FA);

export default router;
