import express from "express";
import auth from "../middleware/auth.js";
import { generateReferralCode, getReferralStats } from "../controllers/referralController.js";

const router = express.Router();

router.get("/code", auth, generateReferralCode);
router.get("/stats", auth, getReferralStats);

export default router;
