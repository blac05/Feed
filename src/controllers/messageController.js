import {
  createMessage,
  getMessages,
} from "../services/messageService.js";

export const sendMessage =
  async (req, res, next) => {
    try {
      const message =
        await createMessage({
          conversation:
            req.body.conversationId,

          sender:
            req.user._id,

          text:
            req.body.text,
        });

      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      next(error);
    }
  };

export const fetchMessages =
  async (req, res, next) => {
    try {
      const messages =
        await getMessages(
          req.params.id
        );

      res.json({
        success: true,
        messages,
      });
    } catch (error) {
      next(error);
    }
  };
