import express from "express";

import auth from "../middleware/auth.js";

import {
  reactToStory,
  getStoryReactions,
} from "../controllers/storyReactionController.js";

const router =
  express.Router();

router.post(
  "/",
  auth,
  reactToStory
);

router.get(
  "/:storyId",
  auth,
  getStoryReactions
);

export default router;
