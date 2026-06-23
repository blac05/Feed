// Helper to generate a deterministic, unique room identity string for private messaging channels
const getRoomId = (idA, idB) => {
  if (!idA || !idB) return null;
  return [idA.toString(), idB.toString()].sort().join("-");
};

export default function chatSocket(io) {
  io.on("connection", (socket) => {

    // ==========================================
    // 1. ROOM LIFECYCLE MANAGEMENT
    // ==========================================

    // Join direct message room channel
    socket.on("join-dm", ({ userId, otherUserId }) => {
      const room = getRoomId(userId, otherUserId);
      if (!room) return;

      socket.join(room);
      socket.currentDmRoom = room;
      socket.userId = userId;

      // Broadcast immediate system dispatch letting the sender know messages are safely delivered
      socket.to(room).emit("messages-delivered", { by: userId });
    });

    // Leave current message context cleanly
    socket.on("leave-dm", ({ userId, otherUserId }) => {
      const room = getRoomId(userId, otherUserId);
      if (!room) return;

      socket.leave(room);
      if (socket.currentDmRoom === room) {
        socket.currentDmRoom = null;
      }
    });

    // ==========================================
    // 2. MESSAGE TRANSMISSION & TYPING DISPATCHES
    // ==========================================

    // Dispatches new text, image uploads, or threaded comment replies inside the channel
    socket.on("send-dm", (data) => {
      const { senderId, receiverId, text, image, senderAvatar, senderUsername, replyTo, tempId } = data;
      const room = getRoomId(senderId, receiverId);
      if (!room) return;

      const messagePayload = {
        tempId,
        id: `msg_${Date.now()}`, // Generated server-fallback identifier prefix
        senderId,
        receiverId,
        text: text || "",
        image: image || "",
        senderAvatar,
        senderUsername,
        replyTo: replyTo || null,
        time: new Date().toISOString(),
        read: false,
        reactions: [],
      };

      // Emits to all active listeners in the chat room (syncs multi-device sessions for the sender)
      io.to(room).emit("receive-dm", messagePayload);
    });

    // Real-time user input/typing indicator listeners
    socket.on("typing", ({ senderId, receiverId }) => {
      const room = getRoomId(senderId, receiverId);
      if (room) socket.to(room).emit("user-typing", { senderId });
    });

    socket.on("stop-typing", ({ senderId, receiverId }) => {
      const room = getRoomId(senderId, receiverId);
      if (room) socket.to(room).emit("user-stop-typing", { senderId });
    });

    // ==========================================
    // 3. INTERACTIVE ENGAGEMENTS & STATE SYNC
    // ==========================================

    // Emoji reactions modification
    socket.on("dm-reaction", ({ messageId, emoji, userId, conversationId }) => {
      if (conversationId) {
        io.to(conversationId).emit("message-reaction", { messageId, emoji, userId });
      }
    });

    // Message erasure event
    socket.on("dm-delete", ({ messageId, conversationId }) => {
      if (conversationId) {
        io.to(conversationId).emit("message-deleted", { messageId });
      }
    });

    // Explicit read receipt acknowledgment triggers
    socket.on("messages-read", ({ conversationId, by }) => {
      if (conversationId) {
        socket.to(conversationId).emit("messages-read", { by, conversationId });
      }
    });

    // ==========================================
    // 4. CLEANUP ACTIONS ON USER DISCONNECT
    // ==========================================
    socket.on("disconnect", () => {
      // If client session falls offline abruptly, systematically strip active typing states
      if (socket.currentDmRoom && socket.userId) {
        socket.to(socket.currentDmRoom).emit("user-stop-typing", { senderId: socket.userId });
      }
    });
  });
}

