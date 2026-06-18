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

    // Account type
    accountType: {
      type: String,
      enum: ["personal", "company", "prominent", "creator", "popstar"],
      default: "personal",
    },

    // Verification
    isVerified: { type: Boolean, default: false },
    verificationRequested: { type: Boolean, default: false },

    // Role
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // Social
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
