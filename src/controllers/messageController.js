import Message from "../models/Message.js";
import { getIO } from "../sockets/socketServer.js";

// Helper to generate a unique deterministic conversation ID for peer-to-peer chats
const getConvId = (a, b) => [a.toString(), b.toString()].sort().join("-");

/**
 * @route   GET /api/messages/:userId
 * @desc    Fetch message history between current user and a target peer, marking unread messages as read
 */
export const getMessages = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;
    const convId = getConvId(currentUserId, userId);

    const messages = await Message.find({ conversationId: convId, deleted: false })
      .populate("sender", "username name avatar")
      .populate("receiver", "username name avatar")
      .populate({
        path: "replyTo",
        populate: { path: "sender", select: "username name avatar" },
      })
      .sort({ createdAt: 1 })
      .limit(100);

    // Bulk-update unread messages sent by the peer to 'read' status
    await Message.updateMany(
      { conversationId: convId, sender: userId, read: false },
      { read: true, readAt: new Date() }
    );

    // Emit live read-receipt update notification via WebSockets
    try {
      const io = getIO();
      io.to(userId.toString()).emit("messages-read", { 
        by: currentUserId, 
        conversationId: convId 
      });
    } catch (socketError) {
      console.error("Socket emit failed in getMessages:", socketError.message);
    }

    res.json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};

// Alias to satisfy imports looking for Chunk 1's naming convention
export { getMessages as fetchMessages };

/**
 * @route   POST /api/messages
 * @desc    Send a new message with support for images and message thread replies
 */
export const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, text, image, replyToId } = req.body;
    const currentUserId = req.user._id;

    if (!text?.trim() && !image) {
      return res.status(400).json({ success: false, message: "Message cannot be empty" });
    }

    const convId = getConvId(currentUserId, receiverId);
    
    const message = await Message.create({
      conversationId: convId,
      sender: currentUserId,
      receiver: receiverId,
      text: text?.trim() || "",
      image: image || "",
      replyTo: replyToId || null,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "username name avatar")
      .populate("receiver", "username name avatar")
      .populate({
        path: "replyTo",
        populate: { path: "sender", select: "username name avatar" },
      });

    // Broadcast new message to the conversation room via WebSockets
    try {
      const io = getIO();
      io.to(convId).emit("new-message", populatedMessage);
    } catch (socketError) {
      console.error("Socket emit failed in sendMessage:", socketError.message);
    }

    res.status(201).json({ success: true, message: populatedMessage });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/messages/:id
 * @desc    Soft-delete a message (clears contents but preserves document reference)
 */
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: "Message not found" });
    
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized action" });
    }

    message.deleted = true;
    message.deletedAt = new Date();
    message.text = "";
    message.image = "";
    await message.save();

    try {
      const io = getIO();
      io.to(message.conversationId).emit("message-deleted", { messageId: message._id });
    } catch (socketError) {
      console.error("Socket emit failed in deleteMessage:", socketError.message);
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/messages/:id/react
 * @desc    Add or toggle an emoji reaction on a message
 */
export const reactToMessage = async (req, res, next) => {
  try {
    const { emoji } = req.body;
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: "Message not found" });

    // Filter out any existing reaction from this specific user
    message.reactions = message.reactions.filter(
      r => r.user.toString() !== req.user._id.toString()
    );

    // If an emoji parameter is supplied, insert the new reaction
    if (emoji) {
      message.reactions.push({ user: req.user._id, emoji });
    }
    await message.save();

    try {
      const io = getIO();
      io.to(message.conversationId).emit("message-reaction", {
        messageId: message._id,
        reactions: message.reactions,
      });
    } catch (socketError) {
      console.error("Socket emit failed in reactToMessage:", socketError.message);
    }

    res.json({ success: true, reactions: message.reactions });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/messages/search
 * @desc    Search conversation history using an item filter query
 */
export const searchMessages = async (req, res, next) => {
  try {
    const { userId, q } = req.query;
    if (!q?.trim()) return res.json({ success: true, messages: [] });

    const convId = getConvId(req.user._id, userId);
    const messages = await Message.find({
      conversationId: convId,
      deleted: false,
      text: { $regex: q, $options: "i" },
    })
      .populate("sender", "username name avatar")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};
