import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    endDate: { type: Date },
    location: { type: String, default: "" },
    isOnline: { type: Boolean, default: false },
    streamUrl: { type: String, default: "" },
    category: {
      type: String,
      enum: ["Music", "Sports", "Tech", "Art", "Business", "Education", "Gaming", "Other"],
      default: "Other",
    },
    rsvps: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    maxAttendees: { type: Number, default: 0 },
    isPrivate: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
