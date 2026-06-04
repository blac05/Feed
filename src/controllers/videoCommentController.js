import VideoComment from "../models/VideoComment.js";

import {
  updateCommentCount,
} from "../services/videoService.js";

export const addComment =
  async (req, res, next) => {
    try {
      const {
        videoId,
        text,
      } = req.body;

      const comment =
        await VideoComment.create({
          video: videoId,
          user: req.user._id,
          text,
        });

      await updateCommentCount(
        videoId,
        1
      );

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
        await VideoComment.find({
          video:
            req.params.videoId,
        })
          .populate(
            "user",
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

export const deleteComment =
  async (req, res, next) => {
    try {
      const comment =
        await VideoComment.findById(
          req.params.id
        );

      if (!comment) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Comment not found",
          });
      }

      await updateCommentCount(
        comment.video,
        -1
      );

      await comment.deleteOne();

      res.json({
        success: true,
        message:
          "Comment deleted",
      });
    } catch (error) {
      next(error);
    }
  };
