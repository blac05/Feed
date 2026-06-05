import mongoose from "mongoose";

const productSchema =
  new mongoose.Schema(
    {
      creator: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      title: {
        type: String,
        required: true,
      },

      description: String,

      price: {
        type: Number,
        required: true,
      },

      thumbnail: String,

      category: {
        type: String,
        enum: [
          "digital",
          "course",
          "ticket",
          "membership",
        ],
      },

      downloads: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Product",
  productSchema
);
