import { Server } from "socket.io";

import liveSocket from "./liveSocket.js";

let io;

export const initializeSocket =
  server => {
    io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    liveSocket(io);

    return io;
  };

export const getIO = () =>
  io;
