import LiveStream from "../models/LiveStream.js";

import {
  createToken,
} from "../services/liveService.js";

export const startLive =
  async (req, res, next) => {
    try {
      const roomName =
        `live_${Date.now()}`;

      const stream =
        await LiveStream.create({
          host:
            req.user._id,

          title:
            req.body.title,

          roomName,
        });

      const token =
        createToken(
          roomName,
          req.user._id,
          req.user.username
        );

      res.status(201).json({
        success: true,
        stream,
        token,
      });
    } catch (error) {
      next(error);
    }
  };

export const joinLive =
  async (req, res, next) => {
    try {
      const stream =
        await LiveStream.findById(
          req.params.id
        );

      const token =
        createToken(
          stream.roomName,
          req.user._id,
          req.user.username
        );

      res.json({
        success: true,
        token,
        roomName:
          stream.roomName,
      });
    } catch (error) {
      next(error);
    }
  };

export const getLives =
  async (req, res, next) => {
    try {
      const streams =
        await LiveStream.find({
          isLive: true,
        })
          .populate(
            "host",
            "username avatar"
          )
          .sort({
            createdAt: -1,
          });

      res.json({
        success: true,
        streams,
      });
    } catch (error) {
      next(error);
    }
  };

export const endLive =
  async (req, res, next) => {
    try {
      await LiveStream.findByIdAndUpdate(
        req.params.id,
        {
          isLive: false,
        }
      );

      res.json({
        success: true,
        message:
          "Live ended",
      });
    } catch (error) {
      next(error);
    }
  };
