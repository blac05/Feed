import {Wallet} from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";

import {
  initializePayment,
  verifyPayment,
} from "../services/paymentService.js";

export const buyCoins = async (
  req,
  res,
  next
) => {
  try {
    const { amount } = req.body;

    const payment =
      await initializePayment({
        email: req.user.email,
        amount,
      });

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyCoinsPurchase =
  async (req, res, next) => {
    try {
      const { reference, coins } =
        req.body;

      const result =
        await verifyPayment(reference);

      if (
        result.data.status !==
        "success"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Payment verification failed",
        });
      }

      const wallet =
        await Wallet.findOneAndUpdate(
          {
            user: req.user._id,
          },
          {
            $inc: {
              coins,
            },
          },
          {
            new: true,
          }
        );

      await Transaction.create({
        user: req.user._id,
        amount:
          result.data.amount / 100,
        coins,
        type: "purchase",
      });

      res.json({
        success: true,
        wallet,
      });
    } catch (error) {
      next(error);
    }
  };
