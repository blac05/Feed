import express from "express";
import auth from "../middleware/auth.js";
import {
  getMyWallet, initializePayment, verifyPayment,
  testTopUp, sendTip, getTransactions,
} from "../controllers/walletController.js";

const router = express.Router();

router.get("/", auth, getMyWallet);
router.get("/transactions", auth, getTransactions);
router.post("/topup", auth, initializePayment);
router.post("/topup/test", auth, testTopUp);
router.get("/verify/:reference", auth, verifyPayment);
router.post("/tip", auth, sendTip);

export default router;
