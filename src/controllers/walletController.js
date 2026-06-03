import Wallet from "../models/Wallet.js";

export const getMyWallet =
  async (req, res) => {
    const wallet =
      await Wallet.findOne({
        user:
          req.user._id,
      });

    res.json({
      success: true,
      wallet,
    });
  };
