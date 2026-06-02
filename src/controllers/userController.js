import User from "../models/User.js";
import Follow from "../models/Follow.js";

export const getProfile =
  async (req, res, next) => {
    try {
      const user =
        await User.findById(
          req.params.id
        ).select("-password");

      res.json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  };

export const followUser =
  async (req, res, next) => {
    try {
      await Follow.create({
        follower:
          req.user._id,

        following:
          req.params.id,
      });

      res.json({
        success: true,
        message:
          "User followed",
      });
    } catch (error) {
      next(error);
    }
  };