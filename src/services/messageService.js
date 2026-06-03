import Message from "../models/Message.js";

export const createMessage =
  data =>
    Message.create(data);

export const getMessages =
  conversationId =>
    Message.find({
      conversation:
        conversationId,
    })
      .populate(
        "sender",
        "username avatar"
      )
      .sort({
        createdAt: 1,
      });
