import express from "express";
import { 
  initiateEscrowTransfer, 
  releaseEscrowFunds, 
  refundEscrowFunds 
} from "../controllers/marketplaceController.js";
// FIXED: Removed the curly braces to correctly import the default export from auth.js as 'protect'
import protect from "../middleware/auth.js"; 

const router = express.Router();

// Escrow State Machine Links
router.post("/escrow/initiate", protect, initiateEscrowTransfer);
router.post("/escrow/release", protect, releaseEscrowFunds);
router.post("/escrow/refund", protect, refundEscrowFunds);

export default router;