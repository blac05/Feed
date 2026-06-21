const mongoose = require("mongoose");
const Escrow = require("../models/Escrow");
const Wallet = require("../models/Wallet");
const Product = require("../models/Product");

exports.initiateEscrowTransfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { productId, offerAmount } = req.body;
    const buyerId = req.user.id; // From your auth middleware

    // 1. Fetch product and verify availability
    const product = await Product.findById(productId).session(session);
    if (!product) {
      return res.status(404).json({ message: "Asset target not found." });
    }
    if (product.status !== "available") {
      return res.status(400).json({ message: "Asset is no longer available for trading." });
    }

    // 2. Locate buyer's wallet and check liquidity balance
    const buyerWallet = await Wallet.findOne({ user: buyerId }).session(session);
    if (!buyerWallet || buyerWallet.balance < offerAmount) {
      return res.status(400).json({ message: "Insufficient balance to cover trade valuation." });
    }

    // 3. Execute Ledger Adjustments (Deduct balance, move to frozen storage)
    buyerWallet.balance -= offerAmount;
    buyerWallet.frozenFunds += offerAmount;
    await buyerWallet.save({ session });

    // 4. Create the Escrow Ledger Record
    const escrowRecord = await Escrow.create(
      [
        {
          product: productId,
          buyer: buyerId,
          seller: product.seller,
          amount: offerAmount,
          status: "held"
        }
      ],
      { session }
    );

    // 5. Update Product Allocation Status
    product.status = "pending_escrow";
    await product.save({ session });

    // Commit changes to database permanently
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Funds successfully secured in platform escrow storage loop.",
      escrowId: escrowRecord[0]._id
    });

  } catch (error) {
    // Fail-safe rollback configuration
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: "Transaction failed. Balances preserved.", error: error.message });
  }
};

// Releases frozen escrow funds directly into the seller's available balance
exports.releaseEscrowFunds = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { escrowId } = req.body;
    const userId = req.user.id; // Authenticated buyer trigger

    // 1. Locate the escrow record and populate referenced models
    const escrow = await Escrow.findById(escrowId).session(session);
    if (!escrow) {
      return res.status(404).json({ message: "Escrow record not found." });
    }

    // 2. Security Check: Only the designated buyer can greenlight the release
    if (escrow.buyer.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized. Only the buyer can confirm item delivery." });
    }

    if (escrow.status !== "held") {
      return res.status(400).json({ message: `Transaction cannot be completed. Current status: ${escrow.status}` });
    }

    // 3. Clear locked capital from Buyer's ledger
    const buyerWallet = await Wallet.findOne({ user: escrow.buyer }).session(session);
    if (buyerWallet) {
      buyerWallet.frozenFunds = Math.max(0, buyerWallet.frozenFunds - escrow.amount);
      await buyerWallet.save({ session });
    }

    // 4. Inject liquid capital into Seller's available balance
    const sellerWallet = await Wallet.findOne({ user: escrow.seller }).session(session);
    if (!sellerWallet) {
      return res.status(404).json({ message: "Seller payout ledger destination missing." });
    }
    sellerWallet.balance += escrow.amount;
    await sellerWallet.save({ session });

    // 5. Update state markers across the collection ecosystems
    escrow.status = "released";
    escrow.releasedAt = new Date();
    await escrow.save({ session });

    await Product.findByIdAndUpdate(
      escrow.product, 
      { status: "sold" }, 
      { session }
    );

    // Commit all atomic balance updates simultaneously
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Capital clear. Settlement dispatched to vendor wallet.",
      status: "released"
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: "Settlement processing failure.", error: error.message });
  }
};


// Safe Reversal: Cancels the deal and safely returns frozen funds back to the buyer
exports.refundEscrowFunds = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { escrowId } = req.body;
    const userId = req.user.id; // Triggered by admin intervention or mutual agreement logic

    const escrow = await Escrow.findById(escrowId).session(session);
    if (!escrow) {
      return res.status(404).json({ message: "Escrow record target not found." });
    }

    // Security Check: Guarding the balance state
    if (escrow.status !== "held") {
      return res.status(400).json({ message: "Funds have already breached the holding pattern." });
    }

    // 1. Return frozen funds directly back into buyer's spendable balance
    const buyerWallet = await Wallet.findOne({ user: escrow.buyer }).session(session);
    if (!buyerWallet) {
      return res.status(404).json({ message: "Buyer refund route target missing." });
    }

    buyerWallet.frozenFunds = Math.max(0, buyerWallet.frozenFunds - escrow.amount);
    buyerWallet.balance += escrow.amount;
    await buyerWallet.save({ session });

    // 2. Reset Escrow record status to avoid multi-execution attacks
    escrow.status = "refunded";
    escrow.refundedAt = new Date();
    await escrow.save({ session });

    // 3. Put asset back up for public listing inside the market
    await Product.findByIdAndUpdate(
      escrow.product, 
      { status: "available" }, 
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Escrow tear-down verified. Liquidity restored to buyer allocation layer.",
      status: "refunded"
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: "Reversal routine aborted safely.", error: error.message });
  }
};

