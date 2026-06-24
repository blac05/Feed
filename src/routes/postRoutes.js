import express from "express";
import auth from "../middleware/auth.js";
import {
  createPost, getPosts, getFollowingPosts, getTrendingPosts,
  getHashtagPosts, getTrendingHashtags, getPost, deletePost,
  likePost, reactToPost, voteOnPoll, addComment,
  getHeadlinesHot, getHeadlinesNew, getHeadlinesTop, getHeadlinesRising,
  voteOnPost, giveAward,
} from "../controllers/postController.js";

const router = express.Router();

// Standard feed
router.get("/", getPosts);
router.get("/following", auth, getFollowingPosts);
router.get("/trending", getTrendingPosts);
router.get("/hashtag/:tag", getHashtagPosts);
router.get("/trending-hashtags", getTrendingHashtags);

// Headlines feed
router.get("/headlines/hot", getHeadlinesHot);
router.get("/headlines/new", getHeadlinesNew);
router.get("/headlines/top", getHeadlinesTop);
router.get("/headlines/rising", getHeadlinesRising);

// Single post
router.get("/:id", getPost);
router.post("/", auth, createPost);
router.delete("/:id", auth, deletePost);

// Interactions
router.put("/:id/like", auth, likePost);
router.post("/:id/react", auth, reactToPost);
router.post("/:id/vote", auth, voteOnPoll);
router.post("/:id/comment", auth, addComment);
router.post("/:id/upvote", auth, voteOnPost);
router.post("/:id/award", auth, giveAward);

export default router;
