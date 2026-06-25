import mongoose from "mongoose";

const audioSpaceSchema = new mongoose.Schema(
  {
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    topic: {
      type: String,
      enum: ["Tech", "Music", "Sports", "Business", "Education", "Entertainment", "Politics", "Health", "Other"],
      default: "Other",
    },
    isLive: { type: Boolean, default: true },
    roomId: { type: String, required: true, unique: true },
    speakers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        joinedAt: { type: Date, default: Date.now },
        isMuted: { type: Boolean, default: false },
      },
    ],
    listeners: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    raisedHands: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    scheduledFor: { type: Date },
    endedAt: { type: Date },
    peakListeners: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("AudioSpace", audioSpaceSchema);
