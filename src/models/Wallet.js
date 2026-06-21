const WalletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    frozenFunds: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);