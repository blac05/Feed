import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

// Core Platform Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import liveRoutes from "./routes/liveRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// Newly Integrated Feature Routes
import messageRoutes from "./routes/messageRoutes.js";
import pushRoutes from "./routes/pushRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

const app = express();

// ==========================================
// SECURITY & REQUEST OPTIMIZATION MIDDLEWARE
// ==========================================

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      origin.endsWith(".vercel.app") ||
      origin === "http://localhost:5173" ||
      origin === "http://localhost:3000"
    ) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions));

// Protect HTTP headers (disabled CORP rule to allow local resource asset serving)
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Brute-force protection for authentication pathways
app.use("/api/auth", rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { success: false, message: "Too many requests, please try again later." },
}));

// ==========================================
// SYSTEM DIAGNOSTICS HEALTH CHECKS
// ==========================================
app.get("/", (req, res) => res.json({ status: "Feed API running 🚀", timestamp: new Date() }));
app.get("/health", (req, res) => res.json({ status: "ok" }));

// ==========================================
// API ENDPOINT ROUTING MOUNTING
// ==========================================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/live", liveRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

// Consolidated Real-Time Communication & Content Controls
app.use("/api/messages", messageRoutes);
app.use("/api/push", pushRoutes);
app.use("/api/reports", reportRoutes);

// ==========================================
// FALLBACK EXCEPTION INTERCEPTORS (ORDER CRITICAL)
// ==========================================

// 1. Catch-All 404 Handler (Triggers when NO route matches the inbound path)
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// 2. Global Error Handler Middleware (Triggers explicitly via next(error) inside handlers)
app.use((err, req, res, next) => {
  console.error("System Error Context:", err.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

export default app;
