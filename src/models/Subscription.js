import mongoose from "mongoose";

const subscriptionSchema =
  new mongoose.Schema(
    {
      subscriber: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      creator: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      plan: {
        type: String,
        default: "monthly",
      },

      amount: {
        type: Number,
        required: true,
      },

      status: {
        type: String,
        default: "active",
      },

      expiresAt: Date,
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Subscription",
  subscriptionSchema
);
