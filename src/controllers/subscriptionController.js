import Subscription from "../models/Subscription.js";

export const createSubscription =
  async (req, res, next) => {
    try {
      const subscription =
        await Subscription.create({
          subscriber:
            req.user._id,

          creator:
            req.body.creatorId,

          amount:
            req.body.amount,

          expiresAt:
            new Date(
              Date.now() +
                30 *
                  24 *
                  60 *
                  60 *
                  1000
            ),
        });

      res.status(201).json({
        success: true,
        subscription,
      });
    } catch (error) {
      next(error);
    }
  };

export const getSubscriptions =
  async (req, res, next) => {
    try {
      const subscriptions =
        await Subscription.find({
          subscriber:
            req.user._id,
        });

      res.json({
        success: true,
        subscriptions,
      });
    } catch (error) {
      next(error);
    }
  };
