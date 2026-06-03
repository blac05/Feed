import express from "express";

import auth from "../middleware/auth.js";

import {
  startLive,
  joinLive,
  getLives,
  endLive,
} from "../controllers/liveController.js";

const router =
  express.Router();

router.get(
  "/",
  getLives
);

router.post(
  "/start",
  auth,
  startLive
);

router.get(
  "/join/:id",
  auth,
  joinLive
);

router.put(
  "/end/:id",
  auth,
  endLive
);

export default router;
