import webpush from "web-push";
import PushSubscription from "../models/PushSubscription.js";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL || "mailto:feed@example.com",
  process.env.VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || ""
);

export const getVapidKey = (req, res) => {
  res.json({ success: true, publicKey: process.env.VAPID_PUBLIC_KEY || "" });
};

export const subscribe = async (req, res, next) => {
  try {
    const { endpoint, keys } = req.body;
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ message: "Invalid subscription" });
    }

    // Upsert subscription
    await PushSubscription.findOneAndUpdate(
      { user: req.user._id, endpoint },
      { user: req.user._id, endpoint, keys },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: "Subscribed to push notifications" });
  } catch (error) {
    next(error);
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    const { endpoint } = req.body;
    await PushSubscription.deleteOne({ user: req.user._id, endpoint });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const sendPushToUser = async (userId, payload) => {
  try {
    const subs = await PushSubscription.find({ user: userId });
    const results = await Promise.allSettled(
      subs.map(sub =>
        webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          JSON.stringify(payload)
        ).catch(async (err) => {
          // Remove invalid subscriptions
          if (err.statusCode === 410 || err.statusCode === 404) {
            await PushSubscription.findByIdAndDelete(sub._id);
          }
        })
      )
    );
    return results;
  } catch (error) {
    console.error("Push error:", error.message);
  }
};
