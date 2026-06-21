import express from "express";
import { 
  initiateEscrowTransfer, 
  releaseEscrowFunds, 
  refundEscrowFunds 
} from "../controllers/marketplaceController.js";
import { protect } from "../middleware/authMiddleware.js"; // Adjust path if your auth middleware file is named differently

const router = express.Router();

// Escrow State Machine Links
router.post("/escrow/initiate", protect, initiateEscrowTransfer);
router.post("/escrow/release", protect, releaseEscrowFunds);
router.post("/escrow/refund", protect, refundEscrowFunds);

export default router;
