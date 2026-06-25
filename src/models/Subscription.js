import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    subscriber: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tier: {
      name: { type: String, required: true },
      price: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    startDate: { type: Date, default: Date.now },
    nextBillingDate: { type: Date },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

subscriptionSchema.index({ subscriber: 1, creator: 1 }, { unique: true });

export default mongoose.model("Subscription", subscriptionSchema);
