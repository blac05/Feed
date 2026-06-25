import Subscription from "../models/Subscription.js";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";

export const getCreatorTiers = async (req, res, next) => {
  try {
    const creator = await User.findById(req.params.creatorId).select("subscriptionTiers username name avatar isVerified");
    if (!creator) return res.status(404).json({ message: "Creator not found" });
    res.json({ success: true, tiers: creator.subscriptionTiers || [], creator });
  } catch (error) { next(error); }
};

export const setupTiers = async (req, res, next) => {
  try {
    const { tiers } = req.body;
    if (!Array.isArray(tiers) || tiers.length === 0) {
      return res.status(400).json({ message: "At least one tier is required" });
    }
    const user = await User.findById(req.user._id);
    user.subscriptionTiers = tiers.slice(0, 3).map(t => ({
      name: t.name || "Fan",
      price: Math.max(100, Number(t.price) || 500),
      description: t.description || "",
      perks: t.perks || [],
      active: true,
    }));
    await user.save();
    res.json({ success: true, tiers: user.subscriptionTiers });
  } catch (error) { next(error); }
};

export const subscribe = async (req, res, next) => {
  try {
    const { creatorId, tierName } = req.body;
    if (creatorId === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot subscribe to yourself" });
    }

    const creator = await User.findById(creatorId);
    if (!creator) return res.status(404).json({ message: "Creator not found" });

    const tier = creator.subscriptionTiers?.find(t => t.name === tierName && t.active);
    if (!tier) return res.status(404).json({ message: "Subscription tier not found" });

    // Check wallet
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet || wallet.balance < tier.price) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // Upsert subscription
    const existing = await Subscription.findOne({ subscriber: req.user._id, creator: creatorId });
    if (existing && existing.status === "active") {
      return res.status(400).json({ message: "Already subscribed" });
    }

    // Deduct from subscriber
    wallet.balance -= tier.price;
    wallet.totalSpent += tier.price;
    await wallet.save();

    // Credit creator
    let creatorWallet = await Wallet.findOne({ user: creatorId });
    if (!creatorWallet) creatorWallet = await Wallet.create({ user: creatorId });
    creatorWallet.balance += Math.floor(tier.price * 0.85); // 85% to creator, 15% platform fee
    creatorWallet.totalEarned += Math.floor(tier.price * 0.85);
    await creatorWallet.save();

    // Record transactions
    await Transaction.create({
      user: req.user._id,
      type: "purchase",
      amount: tier.price,
      description: `Subscribed to ${creator.username}'s ${tierName} tier`,
      status: "completed",
    });
    await Transaction.create({
      user: creatorId,
      type: "earning",
      amount: Math.floor(tier.price * 0.85),
      description: `Subscription from @${req.user.username}`,
      status: "completed",
    });

    const nextBilling = new Date();
    nextBilling.setMonth(nextBilling.getMonth() + 1);

    const sub = await Subscription.findOneAndUpdate(
      { subscriber: req.user._id, creator: creatorId },
      {
        subscriber: req.user._id,
        creator: creatorId,
        tier: { name: tier.name, price: tier.price },
        status: "active",
        startDate: new Date(),
        nextBillingDate: nextBilling,
        cancelledAt: null,
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, subscription: sub, message: `Subscribed to ${tierName}!` });
  } catch (error) { next(error); }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({
      subscriber: req.user._id,
      creator: req.params.creatorId,
      status: "active",
    });
    if (!sub) return res.status(404).json({ message: "Subscription not found" });

    sub.status = "cancelled";
    sub.cancelledAt = new Date();
    await sub.save();

    res.json({ success: true, message: "Subscription cancelled" });
  } catch (error) { next(error); }
};

export const getMySubscriptions = async (req, res, next) => {
  try {
    const subs = await Subscription.find({ subscriber: req.user._id, status: "active" })
      .populate("creator", "username name avatar isVerified accountType subscriptionTiers");
    res.json({ success: true, subscriptions: subs });
  } catch (error) { next(error); }
};

export const getMySubscribers = async (req, res, next) => {
  try {
    const subs = await Subscription.find({ creator: req.user._id, status: "active" })
      .populate("subscriber", "username name avatar isVerified accountType")
      .sort({ createdAt: -1 });
    res.json({ success: true, subscribers: subs, count: subs.length });
  } catch (error) { next(error); }
};

export const checkSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({
      subscriber: req.user._id,
      creator: req.params.creatorId,
      status: "active",
    });
    res.json({ success: true, isSubscribed: !!sub, subscription: sub });
  } catch (error) { next(error); }
};
