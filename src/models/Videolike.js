import mongoose from "mongoose";

const videoLikeSchema =
  new mongoose.Schema(
    {
      video: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },

      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "VideoLike",
  videoLikeSchema
);
