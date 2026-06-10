import mongoose from "mongoose";

const videoSchema =
  new mongoose.Schema(
    {
      creator: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      caption: String,

      videoUrl: String,

      thumbnail: String,

      likes: {
        type: Number,
        default: 0,
      },

      comments: {
        type: Number,
        default: 0,
      },

      views: {
        type: Number,
        default: 0,
      },

      shares: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Video",
  videoSchema
);
