import { Server } from "socket.io";
import liveSocket from "./liveSocket.js";
import chatSocket from "./chatSocket.js";

let io;
const onlineUsers = new Map(); // userId -> { socketId, username, avatar, lastSeen }

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (origin.endsWith(".vercel.app") || origin.includes("localhost")) {
          return callback(null, true);
        }
        return callback(new Error("Not allowed"));
      },
      credentials: true,
    },
  });

  io.on("connection", (socket) => {

    // ── User joins their personal room ──
    socket.on("join", ({ userId, username, avatar }) => {
      socket.join(userId);
      socket.userId = userId;
      socket.username = username;

      onlineUsers.set(userId, {
        socketId: socket.id,
        username,
        avatar,
        lastSeen: new Date(),
      });

      // Tell everyone this user is online
      socket.broadcast.emit("user_online", { userId, username, avatar });

      // Send current online list to this user
      socket.emit("online_users", Array.from(onlineUsers.keys()));
    });

    // ── Notification forwarding ──
    socket.on("notify", ({ recipientId, notification }) => {
      io.to(recipientId).emit("notification", notification);
    });

    // ── Typing indicators (for DMs) ──
    socket.on("typing", ({ senderId, receiverId }) => {
      const room = [senderId, receiverId].sort().join("-");
      socket.to(room).emit("user-typing", { senderId });
    });

    socket.on("stop-typing", ({ senderId, receiverId }) => {
      const room = [senderId, receiverId].sort().join("-");
      socket.to(room).emit("user-stop-typing", { senderId });
    });

    // ── Audio Space WebRTC Signaling ──────────────────────────
    socket.on("space-join-room", ({ roomId, userId, username, avatar, role }) => {
      socket.join(roomId);
      socket.spaceRoom = roomId;
      socket.userId = userId;
      // Announce to others
      socket.to(roomId).emit("space-peer-joined", { userId, username, avatar, role });
    });

    socket.on("space-offer", ({ roomId, offer, targetUserId }) => {
      socket.to(roomId).emit("space-offer", { offer, fromUserId: socket.userId, targetUserId });
    });

    socket.on("space-answer", ({ roomId, answer, targetUserId }) => {
      socket.to(roomId).emit("space-answer", { answer, fromUserId: socket.userId, targetUserId });
    });

    socket.on("space-ice-candidate", ({ roomId, candidate, targetUserId }) => {
      socket.to(roomId).emit("space-ice-candidate", { candidate, fromUserId: socket.userId, targetUserId });
    });

    socket.on("space-mute-toggle", ({ roomId, userId, isMuted }) => {
      io.to(roomId).emit("space-speaker-muted", { userId, isMuted });
    });

    socket.on("space-leave", ({ roomId, userId }) => {
      socket.leave(roomId);
      socket.spaceRoom = null;
      socket.to(roomId).emit("space-peer-left", { userId });
    });

    // ── Disconnect ──
    socket.on("disconnect", () => {
      // Safety check: If they disconnect abruptly while in an audio space, alert the room
      if (socket.spaceRoom && socket.userId) {
        socket.to(socket.spaceRoom).emit("space-peer-left", { userId: socket.userId });
      }

      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        socket.broadcast.emit("user_offline", {
          userId: socket.userId,
          lastSeen: new Date(),
        });
      }
    });
  });

  liveSocket(io);
  chatSocket(io);

  return io;
};

export const getIO = () => io;
export const getOnlineUsers = () => onlineUsers;
export const isUserOnline = (userId) => onlineUsers.has(userId.toString());

