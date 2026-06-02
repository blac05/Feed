import Notification from "../models/Notification.js";

export const getNotifications =
  async (req, res, next) => {
    try {
      const notifications =
        await Notification.find({
          recipient:
            req.user._id,
        }).sort({
          createdAt: -1,
        });

      res.json({
        success: true,
        notifications,
      });
    } catch (error) {
      next(error);
    }
  };

export const markAsRead =
  async (req, res, next) => {
    try {
      const notification =
        await Notification.findByIdAndUpdate(
          req.params.id,
          {
            read: true,
          },
          { new: true }
        );

      res.json({
        success: true,
        notification,
      });
    } catch (error) {
      next(error);
    }
  };