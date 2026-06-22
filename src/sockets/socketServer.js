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

    // ── Disconnect ──
    socket.on("disconnect", () => {
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
