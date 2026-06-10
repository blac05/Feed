import { Server } from "socket.io";

import liveSocket from "./liveSocket.js";
import chatSocket from "./chatSocket.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  // Initialize socket handlers after io is created
  liveSocket(io);
  chatSocket(io);

  return io;
};

export const getIO = () => io;