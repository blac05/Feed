import express from "express";

import auth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

import {
  platformStats
}
from "../controllers/analyticsController.js";

const router =
  express.Router();

router.get(
  "/platform",
  auth,
  adminAuth,
  platformStats
);

export default router;
