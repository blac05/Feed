import express from "express";

import auth from "../middleware/auth.js";

import {
  addComment,
  getComments,
  deleteComment,
} from "../controllers/videoCommentController.js";

const router =
  express.Router();

router.post(
  "/",
  auth,
  addComment
);

router.get(
  "/:videoId",
  auth,
  getComments
);

router.delete(
  "/:id",
  auth,
  deleteComment
);

export default router;
