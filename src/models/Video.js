import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caption: {
      type: String,
      maxlength: 300,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    // Optional fields for additional video info
    duration: Number, // in seconds
    category: String,
    privacy: {
      type: String,
      enum: ["public", "private", "unlisted"],
      default: "public",
    },
  },
  {
    timestamps: true,
  }
);

// Optional: add indexes for better query performance
videoSchema.index({ creator: 1 });
videoSchema.index({ createdAt: -1 });

export default mongoose.model("Video", videoSchema);