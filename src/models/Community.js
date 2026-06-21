import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    category: {
      type: String,
      enum: ["Technology", "Sports", "Music", "Gaming", "Art", "Business", "Education", "Other"],
      default: "Other",
    },
    isPrivate: { type: Boolean, default: false },
    rules: [{ type: String }],
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Community", communitySchema);
