import express from "express";
import auth from "../middleware/auth.js";
import {
  getProducts, getProduct, createProduct,
  updateProduct, deleteProduct, likeProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", auth, createProduct);
router.put("/:id", auth, updateProduct);
router.delete("/:id", auth, deleteProduct);
router.put("/:id/like", auth, likeProduct);

export default router;
