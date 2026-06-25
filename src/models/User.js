import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    name: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    website: { type: String, default: "" },
    accountType: {
      type: String,
      enum: ["personal", "company", "prominent", "creator", "popstar"],
      default: "personal",
    },

    // Verification
    isVerified: { type: Boolean, default: false },
    verificationPending: { type: Boolean, default: false },

    // Email verification
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },

    // Password reset
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    // 2FA
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, default: "" },
    twoFactorTempSecret: { type: String, default: "" },

    // Role
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // Moderation
    isBanned: { type: Boolean, default: false },
    banReason: { type: String, default: "" },

    // Block / Mute
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    mutedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Social
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],

    // Karma (sum of upvotes received)
    karma: { type: Number, default: 0 },
    postKarma: { type: Number, default: 0 },
    commentKarma: { type: Number, default: 0 },

    // Creator subscription tiers
    subscriptionTiers: [
      {
        name: { type: String },
        price: { type: Number }, // monthly in naira
        description: { type: String },
        perks: [{ type: String }],
        active: { type: Boolean, default: true },
      },
    ],

    // Referral system
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    referralCount: { type: Number, default: 0 },
    referralEarnings: { type: Number, default: 0 }, // coins earned from referrals

    // Email preferences
    pushNotifications: { type: Boolean, default: true },
    emailDigest: { type: Boolean, default: true },
    lastDigestSent: { type: Date },
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

