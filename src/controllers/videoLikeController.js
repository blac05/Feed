import VideoLike from "../models/VideoLike.js";
import {
  updateLikeCount,
} from "../services/videoService.js";

export const toggleLike =
  async (req, res, next) => {
    try {
      const { videoId } =
        req.body;

      const existing =
        await VideoLike.findOne({
          video: videoId,
          user: req.user._id,
        });

      if (existing) {
        await existing.deleteOne();

        await updateLikeCount(
          videoId,
          -1
        );

        return res.json({
          success: true,
          liked: false,
        });
      }

      await VideoLike.create({
        video: videoId,
        user: req.user._id,
      });

      await updateLikeCount(
        videoId,
        1
      );

      res.json({
        success: true,
        liked: true,
      });
    } catch (error) {
      next(error);
    }
  };

export const getVideoLikes =
  async (req, res, next) => {
    try {
      const likes =
        await VideoLike.find({
          video:
            req.params.videoId,
        }).populate(
          "user",
          "username avatar"
        );

      res.json({
        success: true,
        count: likes.length,
        likes,
      });
    } catch (error) {
      next(error);
    }
  };
