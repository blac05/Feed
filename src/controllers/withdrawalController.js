import Wallet from "../models/Wallet.js";
import Withdrawal from "../models/Withdrawal.js";
import Transaction from "../models/Transaction.js";

export const requestWithdrawal =
  async (req, res, next) => {
    try {
      const { amount } = req.body;

      const wallet =
        await Wallet.findOne({
          user: req.user._id,
        });

      if (
        !wallet ||
        wallet.balance < amount
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Insufficient balance",
        });
      }

      wallet.balance -= amount;

      await wallet.save();

      const withdrawal =
        await Withdrawal.create({
          user: req.user._id,
          amount,
        });

      await Transaction.create({
        user: req.user._id,
        amount,
        type: "withdrawal",
      });

      res.status(201).json({
        success: true,
        withdrawal,
      });
    } catch (error) {
      next(error);
    }
  };

export const getWithdrawals =
  async (req, res, next) => {
    try {
      const withdrawals =
        await Withdrawal.find({
          user: req.user._id,
        }).sort({
          createdAt: -1,
        });

      res.json({
        success: true,
        withdrawals,
      });
    } catch (error) {
      next(error);
    }
  };
