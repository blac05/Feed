import mongoose from "mongoose";

const storyReactionSchema =
  new mongoose.Schema(
    {
      story: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Story",
        required: true,
      },

      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      reaction: {
        type: String,
        enum: [
          "❤️",
          "🔥",
          "😂",
          "😮",
          "😍",
          "👍",
        ],
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "StoryReaction",
  storyReactionSchema
);
