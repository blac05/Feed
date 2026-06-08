import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import liveRoutes from "./routes/liveRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import withdrawalRoutes from "./routes/withdrawalRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import exploreRoutes from "./routes/exploreRoutes.js";
import storyReactionRoutes from "./routes/storyReactionRoutes.js";
import storyViewRoutes from "./routes/storyViewRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import videoLikeRoutes from "./routes/videoLikeRoutes.js";
import videoCommentRoutes from "./routes/videoCommentRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import advertisementRoutes from "./routes/advertisementRoutes.js";
import sponsorshipRoutes from "./routes/sponsorshipRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(
  "/api/story-reactions",
  storyReactionRoutes
);
app.use(
  "/api/communities",
  communityRoutes
);
app.use(
  "/api/video-likes",
  videoLikeRoutes
);

app.use(
  "/api/video-comments",
  videoCommentRoutes
);
app.use(
  "/api/story-views",
  storyViewRoutes
);
app.use(
  "/api/stories",
  storyRoutes
);
app.use(
  "/api/videos",
  videoRoutes
);
app.use(
  "/api/explore",
  exploreRoutes
);

app.use(
  "/api/live",
  liveRoutes
);

app.use(
  "/api/payments",
  paymentRoutes
);

app.use(
  "/api/withdrawals",
  withdrawalRoutes
);

app.use(
  "/api/wallet",
  walletRoutes
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Feed API Running",
  });

});

app.use("/api/auth", authRoutes);

app.use("/api/posts", postRoutes);

app.use("/api/events", eventRoutes);

app.use("/api/comments", commentRoutes);

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/verifications", verificationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/advertisements", advertisementRoutes);
app.use("/api/sponsorships", sponsorshipRoutes);

export default app;
