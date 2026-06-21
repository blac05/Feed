import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    category: {
      type: String,
      enum: ["Electronics", "Clothing", "Accessories", "Home", "Books", "Sports", "Beauty", "Gaming", "Art", "Music", "Food", "Services", "Digital", "Other"],
      default: "Other",
    },
    condition: { type: String, enum: ["new", "like_new", "good", "fair"], default: "new" },
    location: { type: String, default: "" },
    stock: { type: Number, default: 1 },
    sold: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isAvailable: { type: Boolean, default: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
