import Wallet from "../models/Wallet.js";

export const getWallet =
  userId =>
    Wallet.findOne({
      user: userId,
    });

export const addCoins =
  async (
    userId,
    coins
  ) => {
    return Wallet.findOneAndUpdate(
      {
        user: userId,
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
  };
