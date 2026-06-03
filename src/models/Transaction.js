import mongoose from "mongoose";

const transactionSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      amount: Number,

      coins: Number,

      type: {
        type: String,
        enum: [
          "purchase",
          "gift",
          "withdrawal",
        ],
      },

      status: {
        type: String,
        default: "completed",
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Transaction",
  transactionSchema
);
