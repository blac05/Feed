import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Polymorphic targeting points to ANY entity ID (Post, Comment, User, etc.)
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    targetType: {
      type: String,
      enum: ["post", "video", "story", "comment", "live", "user"],
      required: true,
    },
    // Renamed from 'type' to 'category' to avoid confusion with 'targetType'
    category: {
      type: String,
      enum: ["spam", "harassment", "hate_speech", "misinformation", "nudity", "violence", "other"],
      required: true,
    },
    reason: {
      type: String,
      default: "",
    },
    // AI automation insight metrics
    aiScore: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    aiSummary: {
      type: String,
      default: "",
    },
    // Human moderation workflow tracking
    status: {
      type: String,
      enum: ["pending", "reviewed", "actioned", "dismissed"],
      default: "pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewNote: {
      type: String,
      default: "",
    },
  },
  { 
    timestamps: true 
  }
);

// Indexes for high-performance admin queries
reportSchema.index({ targetId: 1, targetType: 1 });
reportSchema.index({ status: 1 });

export default mongoose.model("Report", reportSchema);
