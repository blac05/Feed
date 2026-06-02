import express from "express";

import auth from "../middleware/auth.js";

import {
  createPost,
  getPosts,
  getPost,
  deletePost,
  likePost,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/", getPosts);

router.get("/:id", getPost);

router.post("/", auth, createPost);

router.delete(
  "/:id",
  auth,
  deletePost
);

router.put(
  "/:id/like",
  auth,
  likePost
);

export default router;