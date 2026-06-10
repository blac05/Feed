import Video from "../models/Video.js";
import VideoLike from "../models/Videolike.js";
import VideoComment from "../models/VideoComment.js";
import VideoView from "../models/VideoView.js";

export const createVideo =
  data => Video.create(data);

export const getVideoById =
  id =>
    Video.findById(id).populate(
      "creator",
      "username avatar verified"
    );

export const getFeedVideos =
  () =>
    Video.find()
      .populate(
        "creator",
        "username avatar verified"
      )
      .sort({
        createdAt: -1,
      });

export const addView =
  async (
    videoId,
    userId
  ) => {
    const exists =
      await VideoView.findOne({
        video: videoId,
        user: userId,
      });

    if (!exists) {
      await VideoView.create({
        video: videoId,
        user: userId,
      });

      await Video.findByIdAndUpdate(
        videoId,
        {
          $inc: {
            views: 1,
          },
        }
      );
    }
  };

export const updateLikeCount =
  async (
    videoId,
    increment
  ) => {
    await Video.findByIdAndUpdate(
      videoId,
      {
        $inc: {
          likes: increment,
        },
      }
    );
  };

export const updateCommentCount =
  async (
    videoId,
    increment
  ) => {
    await Video.findByIdAndUpdate(
      videoId,
      {
        $inc: {
          comments: increment,
        },
      }
    );
  };
