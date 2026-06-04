import mongoose from "mongoose";

const videoCommentSchema =
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

      text: String,
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "VideoComment",
  videoCommentSchema
);
