import express from "express";
import auth from "../middleware/auth.js";
import {
  createPost, getPosts, getFollowingPosts, getPost,
  deletePost, likePost, reactToPost, addComment,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/following", auth, getFollowingPosts);
router.get("/:id", getPost);
router.post("/", auth, createPost);
router.delete("/:id", auth, deletePost);
router.put("/:id/like", auth, likePost);
router.post("/:id/react", auth, reactToPost);
router.post("/:id/comment", auth, addComment);

export default router;
