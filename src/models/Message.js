import mongoose from "mongoose";

const messageSchema =
  new mongoose.Schema(
    {
      conversation: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
      },

      sender: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      text: String,

      image: String,

      seen: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Message",
  messageSchema
);
