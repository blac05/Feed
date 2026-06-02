import Comment from "../models/Comment.js";

export const createComment =
  async (req, res, next) => {
    try {
      const comment =
        await Comment.create({
          content:
            req.body.content,

          post:
            req.body.postId,

          author:
            req.user._id,
        });

      res.status(201).json({
        success: true,
        comment,
      });
    } catch (error) {
      next(error);
    }
  };

export const getComments =
  async (req, res, next) => {
    try {
      const comments =
        await Comment.find({
          post:
            req.params.postId,
        })
          .populate(
            "author",
            "username avatar"
          )
          .sort({
            createdAt: -1,
          });

      res.json({
        success: true,
        comments,
      });
    } catch (error) {
      next(error);
    }
  };