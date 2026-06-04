import express from "express";

import auth from "../middleware/auth.js";

import {
  uploadVideo,
  getFeed,
} from "../controllers/videoController.js";

const router =
  express.Router();

router.post(
  "/",
  auth,
  uploadVideo
);

router.get(
  "/feed",
  auth,
  getFeed
);

export default router;
