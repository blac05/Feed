import Story from "../models/Story.js";

export const createStory =
  async (req, res, next) => {
    try {
      const story =
        await Story.create({
          user:
            req.user._id,
          media:
            req.body.media,
          caption:
            req.body.caption,
        });

      res.status(201).json({
        success: true,
        story,
      });
    } catch (error) {
      next(error);
    }
  };

export const getStories =
  async (req, res, next) => {
    try {
      const stories =
        await Story.find({
          expiresAt: {
            $gt: new Date(),
          },
        }).populate(
          "user",
          "username avatar"
        );

      res.json({
        success: true,
        stories,
      });
    } catch (error) {
      next(error);
    }
  };
