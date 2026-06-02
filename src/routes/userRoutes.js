import express from "express";
import auth from "../middleware/auth.js";

import {
  getProfile,
  followUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get(
  "/:id",
  getProfile
);

router.post(
  "/:id/follow",
  auth,
  followUser
);

export default router;