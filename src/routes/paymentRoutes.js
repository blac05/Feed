import express from "express";

import auth from "../middleware/auth.js";

import {
  buyCoins,
  verifyCoinsPurchase,
} from "../controllers/paymentController.js";

const router =
  express.Router();

router.post(
  "/buy-coins",
  auth,
  buyCoins
);

router.post(
  "/verify",
  auth,
  verifyCoinsPurchase
);

export default router;
