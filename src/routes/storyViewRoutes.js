import express from "express";

import auth from "../middleware/auth.js";

import {
  addStoryView,
  getStoryViews,
} from "../controllers/storyViewController.js";

const router =
  express.Router();

router.post(
  "/",
  auth,
  addStoryView
);

router.get(
  "/:storyId",
  auth,
  getStoryViews
);

export default router;
