const express = require("express");
const router = express.Router();
const marketplaceController = require("../controllers/marketplaceController");
const { protect } = require("../middleware/authMiddleware");

// Escrow State Machine Links
router.post("/escrow/initiate", protect, marketplaceController.initiateEscrowTransfer);
router.post("/escrow/release", protect, marketplaceController.releaseEscrowFunds);
router.post("/escrow/refund", protect, marketplaceController.refundEscrowFunds);

module.exports = router;
