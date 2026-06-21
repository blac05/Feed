import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import axios from "axios";

// Get or create wallet
const getOrCreateWallet = async (userId) => {
  let wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    wallet = await Wallet.create({ user: userId });
  }
  return wallet;
};

export const getMyWallet = async (req, res, next) => {
  try {
    const wallet = await getOrCreateWallet(req.user._id);
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("recipient", "username name avatar");
    res.json({ success: true, wallet, transactions });
  } catch (error) {
    next(error);
  }
};

export const initializePayment = async (req, res, next) => {
  try {
    const { amount, email } = req.body;
    if (!amount || amount < 100) {
      return res.status(400).json({ message: "Minimum amount is ₦100" });
    }

    const reference = `feed_${req.user._id}_${Date.now()}`;

    // Initialize Paystack payment
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: email || req.user.email,
        amount: amount * 100, // Paystack uses kobo
        reference,
        metadata: {
          userId: req.user._id,
          type: "wallet_topup",
        },
        callback_url: `${process.env.FRONTEND_URL || "https://feed-frontend-eight.vercel.app"}/wallet?payment=success`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Create pending transaction
    await Transaction.create({
      user: req.user._id,
      type: "topup",
      amount,
      coins: amount * 10, // 1 naira = 10 coins
      reference,
      status: "pending",
      description: `Wallet top-up of ₦${amount}`,
    });

    res.json({
      success: true,
      authorization_url: response.data.data.authorization_url,
      reference,
    });
  } catch (error) {
    console.error("Paystack error:", error.response?.data || error.message);
    // Fallback for testing without Paystack
    res.json({
      success: true,
      authorization_url: null,
      reference: null,
      message: "Paystack not configured — use test top-up",
    });
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { reference } = req.params;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );

    if (response.data.data.status === "success") {
      const transaction = await Transaction.findOne({ reference });
      if (transaction && transaction.status === "pending") {
        transaction.status = "completed";
        await transaction.save();

        // Credit wallet
        const wallet = await getOrCreateWallet(req.user._id);
        wallet.balance += transaction.amount;
        wallet.coins += transaction.coins;
        wallet.totalEarned += transaction.amount;
        await wallet.save();
      }
      res.json({ success: true, message: "Payment verified" });
    } else {
      res.status(400).json({ message: "Payment not successful" });
    }
  } catch (error) {
    next(error);
  }
};

// Test top-up (dev mode)
export const testTopUp = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const coins = (amount || 100) * 10;
    const wallet = await getOrCreateWallet(req.user._id);
    wallet.balance += amount || 100;
    wallet.coins += coins;
    wallet.totalEarned += amount || 100;
    await wallet.save();

    await Transaction.create({
      user: req.user._id,
      type: "topup",
      amount: amount || 100,
      coins,
      status: "completed",
      description: "Test top-up",
    });

    res.json({ success: true, wallet });
  } catch (error) {
    next(error);
  }
};

export const sendTip = async (req, res, next) => {
  try {
    const { recipientId, coins, message } = req.body;
    if (!coins || coins <= 0) return res.status(400).json({ message: "Invalid amount" });

    const senderWallet = await getOrCreateWallet(req.user._id);
    if (senderWallet.coins < coins) {
      return res.status(400).json({ message: "Insufficient coins" });
    }

    // Deduct from sender
    senderWallet.coins -= coins;
    senderWallet.totalSpent += coins;
    await senderWallet.save();

    // Credit recipient
    const recipientWallet = await getOrCreateWallet(recipientId);
    recipientWallet.coins += coins;
    recipientWallet.totalEarned += coins;
    await recipientWallet.save();

    // Record transactions
    await Transaction.create({
      user: req.user._id,
      type: "tip",
      coins,
      recipient: recipientId,
      status: "completed",
      description: message || `Tip sent`,
    });

    await Transaction.create({
      user: recipientId,
      type: "earning",
      coins,
      recipient: req.user._id,
      status: "completed",
      description: `Tip received`,
    });

    res.json({ success: true, message: "Tip sent!" });
  } catch (error) {
    next(error);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("recipient", "username name avatar");
    res.json({ success: true, transactions });
  } catch (error) {
    next(error);
  }
};
