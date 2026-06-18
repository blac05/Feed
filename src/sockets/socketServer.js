import { Server } from "socket.io";
import liveSocket from "./liveSocket.js";
import chatSocket from "./chatSocket.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: function(origin, callback) {
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
    console.log("Socket connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  liveSocket(io);
  chatSocket(io);

  return io;
};

export const getIO = () => io;
