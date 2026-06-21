import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["topup", "gift", "tip", "purchase", "withdrawal", "refund", "earning"],
      required: true,
    },
    amount: { type: Number, default: 0 },
    coins: { type: Number, default: 0 },
    description: { type: String, default: "" },
    reference: { type: String, default: "" },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "completed" },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
