import express from "express";

import auth from "../middleware/auth.js";

import {
  getMyWallet,
} from "../controllers/walletController.js";

const router =
  express.Router();

router.get(
  "/",
  auth,
  getMyWallet
);

export default router;
