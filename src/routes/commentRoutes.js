import express from "express";
import auth from "../middleware/auth.js";

import {
  createComment,
  getComments,
} from "../controllers/commentController.js";

const router = express.Router();

router.post(
  "/",
  auth,
  createComment
);

router.get(
  "/post/:postId",
  getComments
);

export default router;