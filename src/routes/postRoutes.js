import express from "express";
import auth from "../middleware/auth.js";
import {
  createPost, getPosts, getFollowingPosts, getTrendingPosts,
  getHashtagPosts, getTrendingHashtags, getPost, deletePost,
  likePost, reactToPost, voteOnPoll, addComment,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/following", auth, getFollowingPosts);
router.get("/trending", getTrendingPosts);
router.get("/hashtag/:tag", getHashtagPosts);
router.get("/trending-hashtags", getTrendingHashtags);
router.get("/:id", getPost);
router.post("/", auth, createPost);
router.delete("/:id", auth, deletePost);
router.put("/:id/like", auth, likePost);
router.post("/:id/react", auth, reactToPost);
router.post("/:id/vote", auth, voteOnPoll);
router.post("/:id/comment", auth, addComment);

export default router;
