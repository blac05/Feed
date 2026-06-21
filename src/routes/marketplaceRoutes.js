import express from "express";
import { 
  initiateEscrowTransfer, 
  releaseEscrowFunds, 
  refundEscrowFunds 
} from "../controllers/marketplaceController.js";
import { protect } from "../middleware/auth.js"; // Updated to match your auth.js file

const router = express.Router();

// Escrow State Machine Links
router.post("/escrow/initiate", protect, initiateEscrowTransfer);
router.post("/escrow/release", protect, releaseEscrowFunds);
router.post("/escrow/refund", protect, refundEscrowFunds);

export default router;
