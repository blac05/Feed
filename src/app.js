import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import { config } from "dotenv";
import { env } from "./config/env.js";
import "../config/db.js";
import "../models/User.js";
import "../models/Post.js";
import "./models/Comment.js";
import "../models/Follow.js";
import "../models/Notification.js";
import "../models/Event.js";
import "./models/RSVP.js";


config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Feed API Running",
  });
});

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/posts",
  postRoutes
);

app.use(
  "/api/events",
  eventRoutes
);

app.use("/api/auth", authRoutes);

app.use("/api/posts", postRoutes);

app.use("/api/events", eventRoutes);

app.use("/api/comments", commentRoutes);

app.use("/api/users", userRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/live", liveRoutes);

app.use("/api/gifts", giftRoutes);

export default app;