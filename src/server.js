import dotenv from "dotenv";
import http from "http";

import app from "./app.js";
import connectDB from "./config/db.js";

import { initializeSocket } from "./sockets/socketServer.js";

// Load environment variables
dotenv.config();

// Async function to start the server
async function startServer() {
  try {
    // Connect to the database
    await connectDB();

    // Determine port
    const PORT = process.env.PORT || 5000;

    // Create HTTP server
    const server = http.createServer(app);

    // Initialize socket connections
    initializeSocket(server);

    // Start server listening
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); // Exit process with failure code
  }
}

// Start the server
startServer();