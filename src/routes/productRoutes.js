import express from "express";
import auth from "../middleware/auth.js";

import {
  createProduct,
  getProducts,
} from "../controllers/productController.js";

const router =
  express.Router();

router.post(
  "/",
  auth,
  createProduct
);

router.get(
  "/",
  getProducts
);

export default router;
