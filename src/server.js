import dotenv from "dotenv";
dotenv.config(); // ✅ Must be first before any other imports

import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initializeSocket } from "./sockets/socketServer.js";

async function startServer() {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    const server = http.createServer(app);
    initializeSocket(server);
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();