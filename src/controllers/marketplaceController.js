import mongoose from "mongoose";
import Escrow from "../models/Escrow.js";
import Wallet from "../models/Wallet.js";
import Product from "../models/Product.js";

/**
 * Buyer initiates escrow
 */
export const initiateEscrowTransfer = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const result = await session.withTransaction(async () => {
      const { productId, offerAmount } = req.body;
      const buyerId = req.user.id;

      // Validate amount
      if (!offerAmount || Number(offerAmount) <= 0) {
        throw new Error("Invalid offer amount.");
      }

      // Get product
      const product = await Product.findById(productId).session(session);

      if (!product) {
        throw new Error("Product not found.");
      }

      if (product.status !== "available") {
        throw new Error("Product is no longer available.");
      }

      // Prevent self-purchase
      if (product.seller.toString() === buyerId) {
        throw new Error("You cannot purchase your own product.");
      }

      // Prevent duplicate escrow
      const existingEscrow = await Escrow.findOne({
        product: productId,
        status: "held",
      }).session(session);

      if (existingEscrow) {
        throw new Error("Product already has an active escrow.");
      }

      // Atomic wallet deduction
      const buyerWallet = await Wallet.findOneAndUpdate(
        {
          user: buyerId,
          balance: { $gte: offerAmount },
        },
        {
          $inc: {
            balance: -offerAmount,
            frozenFunds: offerAmount,
          },
        },
        {
          new: true,
          session,
        }
      );

      if (!buyerWallet) {
        throw new Error("Insufficient wallet balance.");
      }

      const escrow = await Escrow.create(
        [
          {
            product: productId,
            buyer: buyerId,
            seller: product.seller,
            amount: offerAmount,
            status: "held",
          },
        ],
        { session }
      );

      product.status = "pending_escrow";
      await product.save({ session });

      return escrow[0];
    });

    return res.status(201).json({
      success: true,
      message: "Funds secured in escrow.",
      escrowId: result._id,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

/**
 * Buyer releases escrow to seller
 */
export const releaseEscrowFunds = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const { escrowId } = req.body;
      const buyerId = req.user.id;

      const escrow = await Escrow.findById(escrowId).session(session);

      if (!escrow) {
        throw new Error("Escrow not found.");
      }

      if (escrow.buyer.toString() !== buyerId) {
        throw new Error("Only the buyer can release escrow.");
      }

      if (escrow.status !== "held") {
        throw new Error(`Escrow status is ${escrow.status}.`);
      }

      // Remove frozen funds
      await Wallet.findOneAndUpdate(
        { user: escrow.buyer },
        {
          $inc: {
            frozenFunds: -escrow.amount,
          },
        },
        { session }
      );

      // Ensure seller wallet exists
      let sellerWallet = await Wallet.findOne({
        user: escrow.seller,
      }).session(session);

      if (!sellerWallet) {
        const wallets = await Wallet.create(
          [
            {
              user: escrow.seller,
              balance: 0,
              frozenFunds: 0,
            },
          ],
          { session }
        );

        sellerWallet = wallets[0];
      }

      await Wallet.findOneAndUpdate(
        { user: escrow.seller },
        {
          $inc: {
            balance: escrow.amount,
          },
        },
        { session }
      );

      escrow.status = "released";
      escrow.releasedAt = new Date();

      await escrow.save({ session });

      await Product.findByIdAndUpdate(
        escrow.product,
        {
          status: "sold",
        },
        { session }
      );
    });

    return res.status(200).json({
      success: true,
      status: "released",
      message: "Funds released successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

/**
 * Refund escrow
 */
export const refundEscrowFunds = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const { escrowId } = req.body;
      const userId = req.user.id;

      const escrow = await Escrow.findById(escrowId).session(session);

      if (!escrow) {
        throw new Error("Escrow not found.");
      }

      if (escrow.status !== "held") {
        throw new Error("Escrow is no longer active.");
      }

      // Only buyer or admin can refund
      if (
        escrow.buyer.toString() !== userId &&
        req.user.role !== "admin"
      ) {
        throw new Error("Unauthorized.");
      }

      await Wallet.findOneAndUpdate(
        { user: escrow.buyer },
        {
          $inc: {
            frozenFunds: -escrow.amount,
            balance: escrow.amount,
          },
        },
        { session }
      );

      escrow.status = "refunded";
      escrow.refundedAt = new Date();

      await escrow.save({ session });

      await Product.findByIdAndUpdate(
        escrow.product,
        {
          status: "available",
        },
        { session }
      );
    });

    return res.status(200).json({
      success: true,
      status: "refunded",
      message: "Funds refunded successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};
