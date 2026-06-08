import express from "express";

import auth from "../middleware/auth.js";

import {

  createCommunity,
  getCommunities,

  joinCommunity,

  createCommunityPost,
  getCommunityPosts

}
from "../controllers/communityController.js";

const router =
express.Router();

router.post(
  "/",
  auth,
  createCommunity
);

router.get(
  "/",
  getCommunities
);

router.post(
  "/:id/join",
  auth,
  joinCommunity
);

router.post(
  "/:id/posts",
  auth,
  createCommunityPost
);

router.get(
  "/:id/posts",
  getCommunityPosts
);

export default router;
