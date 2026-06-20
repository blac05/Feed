import express from "express";
import auth from "../middleware/auth.js";
import {
  createStory, getStories, viewStory,
  likeStory, deleteStory,
} from "../controllers/storyController.js";

const router = express.Router();

router.get("/", auth, getStories);
router.post("/", auth, createStory);
router.put("/:id/view", auth, viewStory);
router.put("/:id/like", auth, likeStory);
router.delete("/:id", auth, deleteStory);

export default router;

