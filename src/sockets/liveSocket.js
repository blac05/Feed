export default function liveSocket(io) {
  io.on("connection", (socket) => {

    socket.on("join-live", ({ roomId, userId, username, avatar }) => {
      socket.join(roomId);
      socket.roomId = roomId;
      socket.userId = userId;

      // Announce to room
      io.to(roomId).emit("user-joined", {
        userId, username, avatar,
        message: `${username} joined the stream`,
        time: new Date().toISOString(),
      });
    });

    socket.on("leave-live", ({ roomId, username }) => {
      socket.leave(roomId);
      io.to(roomId).emit("user-left", {
        username,
        message: `${username} left`,
        time: new Date().toISOString(),
      });
    });

    socket.on("live-comment", ({ roomId, text, username, avatar, userId }) => {
      io.to(roomId).emit("live-comment", {
        id: Date.now(),
        userId, username, avatar, text,
        time: new Date().toISOString(),
      });
    });

    socket.on("live-gift", ({ roomId, gift, username, userId }) => {
      io.to(roomId).emit("live-gift", {
        id: Date.now(),
        userId, username, gift,
        time: new Date().toISOString(),
      });
    });

    socket.on("live-like", ({ roomId, userId }) => {
      io.to(roomId).emit("live-like", { userId, time: new Date().toISOString() });
    });

    socket.on("disconnect", () => {
      if (socket.roomId) {
        socket.to(socket.roomId).emit("user-left", {
          message: "A viewer left",
          time: new Date().toISOString(),
        });
      }
    });
  });
}
