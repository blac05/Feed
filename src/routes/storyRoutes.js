import express from "express";
import auth from "../middleware/auth.js";
import {
  createStory, getStories, getHighlights, viewStory,
  likeStory, deleteStory, saveHighlight,
} from "../controllers/storyController.js";

const router = express.Router();

router.get("/", auth, getStories);
router.get("/highlights/:userId", getHighlights);
router.post("/", auth, createStory);
router.post("/highlight", auth, saveHighlight);
router.put("/:id/view", auth, viewStory);
router.put("/:id/like", auth, likeStory);
router.delete("/:id", auth, deleteStory);

export default router;
