import mongoose from "mongoose";

const orderSchema =
  new mongoose.Schema(
    {
      buyer: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      product: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },

      amount: Number,

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
  "Order",
  orderSchema
);
