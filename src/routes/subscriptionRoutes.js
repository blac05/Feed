import express from "express";
import auth from "../middleware/auth.js";

import {
  createSubscription,
  getSubscriptions,
} from "../controllers/subscriptionController.js";

const router =
  express.Router();

router.post(
  "/",
  auth,
  createSubscription
);

router.get(
  "/",
  auth,
  getSubscriptions
);

export default router;
