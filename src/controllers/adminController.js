import User from "../models/User.js";
import Post from "../models/Post.js";
import LiveStream from "../models/LiveStream.js";
import Community from "../models/Community.js";
import Event from "../models/Event.js";

export const getStats = async (req, res, next) => {
  try {
    const [
      totalUsers, totalPosts, activeStreams,
      totalCommunities, totalEvents,
      newUsersToday, verifiedUsers, bannedUsers,
    ] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      LiveStream.countDocuments({ isLive: true }),
      Community.countDocuments(),
      Event.countDocuments(),
      User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
      User.countDocuments({ isVerified: true }),
      User.countDocuments({ isBanned: true }),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers, totalPosts, activeStreams,
        totalCommunities, totalEvents,
        newUsersToday, verifiedUsers, bannedUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const { search, filter, page = 1, limit = 20 } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (filter === "verified") query.isVerified = true;
    if (filter === "banned") query.isBanned = true;
    if (filter === "pending") query.verificationPending = true;
    if (filter === "unverified_email") query.emailVerified = false;

    const users = await User.find(query)
      .select("-password -resetPasswordToken -emailVerificationToken")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);
    res.json({ success: true, users, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

export const verifyUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isVerified = !user.isVerified;
    user.verificationPending = false;
    await user.save();
    res.json({ success: true, isVerified: user.isVerified, message: user.isVerified ? "User verified" : "Verification removed" });
  } catch (error) {
    next(error);
  }
};

export const banUser = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(400).json({ message: "Cannot ban an admin" });
    user.isBanned = true;
    user.banReason = reason || "Violated community guidelines";
    await user.save();
    res.json({ success: true, message: "User banned" });
  } catch (error) {
    next(error);
  }
};

export const unbanUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isBanned = false;
    user.banReason = "";
    await user.save();
    res.json({ success: true, message: "User unbanned" });
  } catch (error) {
    next(error);
  }
};

export const makeAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.role = user.role === "admin" ? "user" : "admin";
    await user.save();
    res.json({ success: true, role: user.role });
  } catch (error) {
    next(error);
  }
};

export const deleteUserPost = async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.json({ success: true, message: "Post removed" });
  } catch (error) {
    next(error);
  }
};

export const getRecentActivity = async (req, res, next) => {
  try {
    const recentUsers = await User.find()
      .select("username name avatar accountType isVerified isBanned createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentPosts = await Post.find()
      .populate("author", "username avatar")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ success: true, recentUsers, recentPosts });
  } catch (error) {
    next(error);
  }
};
