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
