import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import { sendReferralRewardEmail } from "../services/emailService.js";
import crypto from "crypto";

const REFERRAL_COINS = 50; // coins earned per successful referral

export const generateReferralCode = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user.referralCode) {
      user.referralCode = `${user.username}_${crypto.randomBytes(3).toString("hex")}`.toLowerCase();
      await user.save();
    }
    const referralLink = `${process.env.FRONTEND_URL}/register?ref=${user.referralCode}`;
    res.json({ success: true, code: user.referralCode, link: referralLink });
  } catch (error) { next(error); }
};

export const getReferralStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("referralCode referralCount referralEarnings");
    const referredUsers = await User.find({ referredBy: req.user._id })
      .select("username name avatar createdAt")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      code: user.referralCode,
      link: user.referralCode ? `${process.env.FRONTEND_URL}/register?ref=${user.referralCode}` : null,
      count: user.referralCount || 0,
      earnings: user.referralEarnings || 0,
      referredUsers,
    });
  } catch (error) { next(error); }
};

// Called on successful registration with a referral code
export const processReferral = async (referralCode, newUserId) => {
  try {
    if (!referralCode) return;
    const referrer = await User.findOne({ referralCode });
    if (!referrer) return;

    const newUser = await User.findById(newUserId);
    if (!newUser || newUser.referredBy) return; // Already has a referrer

    // Link the referral
    newUser.referredBy = referrer._id;
    await newUser.save();

    // Credit referrer
    referrer.referralCount += 1;
    referrer.referralEarnings += REFERRAL_COINS;
    await referrer.save();

    let wallet = await Wallet.findOne({ user: referrer._id });
    if (!wallet) wallet = await Wallet.create({ user: referrer._id });
    wallet.coins += REFERRAL_COINS;
    await wallet.save();

    await Transaction.create({
      user: referrer._id,
      type: "earning",
      coins: REFERRAL_COINS,
      description: `Referral reward — @${newUser.username} joined`,
      status: "completed",
    });

    // Send reward email
    await sendReferralRewardEmail(referrer.email, referrer.name || referrer.username, REFERRAL_COINS, newUser.username);
  } catch (e) {
    console.error("Referral processing error:", e.message);
  }
};
