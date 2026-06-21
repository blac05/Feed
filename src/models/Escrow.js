const mongoose = require("mongoose");

const EscrowSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["held", "released", "refunded"],
      default: "held"
    },
    releasedAt: Date,
    refundedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Escrow", EscrowSchema);
