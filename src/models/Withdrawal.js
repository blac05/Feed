import mongoose from "mongoose";

const withdrawalSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      amount: Number,

      status: {
        type: String,
        default: "pending",
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Withdrawal",
  withdrawalSchema
);
