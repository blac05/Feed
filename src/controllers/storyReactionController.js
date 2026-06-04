import StoryReaction from "../models/StoryReaction.js";

export const reactToStory =
  async (req, res, next) => {
    try {
      const {
        storyId,
        reaction,
      } = req.body;

      const existing =
        await StoryReaction.findOne({
          story: storyId,
          user: req.user._id,
        });

      if (existing) {
        existing.reaction =
          reaction;

        await existing.save();

        return res.json({
          success: true,
          reaction: existing,
        });
      }

      const storyReaction =
        await StoryReaction.create({
          story: storyId,
          user: req.user._id,
          reaction,
        });

      res.status(201).json({
        success: true,
        reaction:
          storyReaction,
      });
    } catch (error) {
      next(error);
    }
  };

export const getStoryReactions =
  async (req, res, next) => {
    try {
      const reactions =
        await StoryReaction.find({
          story: req.params.storyId,
        }).populate(
          "user",
          "username avatar"
        );

      res.json({
        success: true,
        count:
          reactions.length,
        reactions,
      });
    } catch (error) {
      next(error);
    }
  };
