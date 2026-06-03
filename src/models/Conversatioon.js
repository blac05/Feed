import mongoose from "mongoose";

const conversationSchema =
  new mongoose.Schema(
    {
      participants: [
        {
          type:
            mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],

      isGroup: {
        type: Boolean,
        default: false,
      },

      name: String,

      avatar: String,
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Conversation",
  conversationSchema
);
