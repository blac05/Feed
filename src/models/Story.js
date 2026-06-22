import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Media
    image: { type: String, default: "" },
    video: { type: String, default: "" },
    mediaType: { type: String, enum: ["image", "video", "text"], default: "image" },

    // Text story
    text: { type: String, default: "" },
    textColor: { type: String, default: "#ffffff" },
    background: { type: String, default: "#2563eb" }, // gradient or solid

    caption: { type: String, default: "" },
    views: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Highlight
    isHighlight: { type: Boolean, default: false },
    highlightTitle: { type: String, default: "" },
    highlightCover: { type: String, default: "" },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

export default mongoose.model("Story", storySchema);
