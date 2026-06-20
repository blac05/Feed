// chatSocket.js
export default function chatSocket(io) {
  io.on("connection", (socket) => {

    // Join a DM room — room ID is sorted user IDs joined
    socket.on("join-dm", ({ userId, otherUserId }) => {
      const room = [userId, otherUserId].sort().join("-");
      socket.join(room);
    });

    // Send a DM
    socket.on("send-dm", ({ senderId, receiverId, text, senderAvatar, senderUsername }) => {
      const room = [senderId, receiverId].sort().join("-");
      const message = {
        id: Date.now(),
        senderId,
        text,
        senderAvatar,
        senderUsername,
        time: new Date().toISOString(),
      };
      io.to(room).emit("receive-dm", message);
    });

    // Typing indicator
    socket.on("typing", ({ senderId, receiverId }) => {
      const room = [senderId, receiverId].sort().join("-");
      socket.to(room).emit("user-typing", { senderId });
    });

    socket.on("stop-typing", ({ senderId, receiverId }) => {
      const room = [senderId, receiverId].sort().join("-");
      socket.to(room).emit("user-stop-typing", { senderId });
    });
  });
}
