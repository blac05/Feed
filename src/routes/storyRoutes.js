import express from "express";

import auth from "../middleware/auth.js";

import {
  createStory,
  getStories,
} from "../controllers/storyController.js";

const router =
  express.Router();

router.post(
  "/",
  auth,
  createStory
);

router.get(
  "/",
  auth,
  getStories
);

export default router;
