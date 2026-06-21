import mongoose from "mongoose";

const liveStreamSchema = new mongoose.Schema(
  {
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    roomName: { type: String, required: true, unique: true },
    isLive: { type: Boolean, default: true },
    viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    viewerCount: { type: Number, default: 0 },
    peakViewers: { type: Number, default: 0 },
    category: {
      type: String,
      enum: ["Gaming", "Music", "Talk", "Sports", "Education", "Art", "Just Chatting", "Other"],
      default: "Just Chatting",
    },
    tags: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    endedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("LiveStream", liveStreamSchema);
