import mongoose from "mongoose";

const liveStreamSchema =
  new mongoose.Schema(
    {
      host: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      title: {
        type: String,
        required: true,
      },

      roomName: {
        type: String,
        unique: true,
      },

      thumbnail: String,

      viewers: {
        type: Number,
        default: 0,
      },

      isLive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "LiveStream",
  liveStreamSchema
);
