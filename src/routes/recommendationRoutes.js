import express from "express";

import auth from "../middleware/auth.js";

import {
  getRecommendations
}
from "../controllers/recommendationController.js";

const router =
  express.Router();

router.get(
  "/feed",
  auth,
  getRecommendations
);

export default router;
