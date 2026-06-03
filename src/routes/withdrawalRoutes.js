import express from "express";

import auth from "../middleware/auth.js";

import {
  requestWithdrawal,
  getWithdrawals,
} from "../controllers/withdrawalController.js";

const router =
  express.Router();

router.post(
  "/request",
  auth,
  requestWithdrawal
);

router.get(
  "/history",
  auth,
  getWithdrawals
);

export default router;
