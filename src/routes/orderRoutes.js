import express from "express";
import auth from "../middleware/auth.js";

import {
  createOrder,
  getMyOrders,
} from "../controllers/orderController.js";

const router =
  express.Router();

router.post(
  "/",
  auth,
  createOrder
);

router.get(
  "/my-orders",
  auth,
  getMyOrders
);

export default router;
