import Video from "../models/Video.js";

export const uploadVideo =
  async (req, res, next) => {
    try {
      const video =
        await Video.create({
          creator:
            req.user._id,

          caption:
            req.body.caption,

          videoUrl:
            req.body.videoUrl,

          thumbnail:
            req.body.thumbnail,
        });

      res.status(201).json({
        success: true,
        video,
      });
    } catch (error) {
      next(error);
    }
  };

export const getFeed =
  async (req, res, next) => {
    try {
      const videos =
        await Video.find()
          .populate(
            "creator",
            "username avatar verified"
          )
          .sort({
            createdAt: -1,
          });

      res.json({
        success: true,
        videos,
      });
    } catch (error) {
      next(error);
    }
  };
