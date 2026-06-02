import dotenv from "dotenv";
import http from "http";

import app from "./app.js";
import db from "./config/db.js";

import {
  initializeSocket,
} from "./sockets/socketServer.js";

dotenv.config();

connectDB();

const PORT =
  process.env.PORT || 5000;

const server =
  http.createServer(app);

initializeSocket(server);

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});