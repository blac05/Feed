import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  frozenFunds: {
    type: Number,
    default: 0, // Funds currently locked in escrow
  },
});

export default mongoose.model("Wallet", WalletSchema);