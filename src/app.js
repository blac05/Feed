import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
// ... other imports ...
import storyReactionRoutes from "./routes/storyReactionRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
// ... other imports ...


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

// Your route usages
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
app.use("/api/live", liveRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/wallet", walletRoutes);
app.use(express.json());
app.use("/", (req, res) => {
  res.json({ success: true, message: "Feed API Running" });
});
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/podcasts", podcastRoutes);
app.use("/api/spaces", audioSpaceRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/video-calls", videoCallRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportRoutes); // Keep only this one
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

// Remove the duplicate:
 // app.use('/reports', reportRoutes); // <-- delete this line

export default app;