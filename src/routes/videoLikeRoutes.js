import express from "express";

import auth from "../middleware/auth.js";

import {
  toggleLike,
  getVideoLikes,
} from "../controllers/videoLikeController.js";

const router =
  express.Router();

router.post(
  "/",
  auth,
  toggleLike
);

router.get(
  "/:videoId",
  auth,
  getVideoLikes
);

export default router;
