import StoryView from "../models/StoryView.js";

export const addStoryView =
  async (req, res, next) => {
    try {
      const { storyId } =
        req.body;

      const alreadyViewed =
        await StoryView.findOne({
          story: storyId,
          viewer:
            req.user._id,
        });

      if (alreadyViewed) {
        return res.json({
          success: true,
          message:
            "Already viewed",
        });
      }

      await StoryView.create({
        story: storyId,
        viewer:
          req.user._id,
      });

      res.status(201).json({
        success: true,
        message:
          "View added",
      });
    } catch (error) {
      next(error);
    }
  };

export const getStoryViews =
  async (req, res, next) => {
    try {
      const views =
        await StoryView.find({
          story:
            req.params.storyId,
        }).populate(
          "viewer",
          "username avatar"
        );

      res.json({
        success: true,
        count: views.length,
        views,
      });
    } catch (error) {
      next(error);
    }
  };
