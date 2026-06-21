import express from "express";
import auth from "../middleware/auth.js";
import {
  getCommunities, getCommunity, createCommunity,
  joinCommunity, deleteCommunity,
} from "../controllers/communityController.js";

const router = express.Router();

router.get("/", getCommunities);
router.get("/:id", getCommunity);
router.post("/", auth, createCommunity);
router.post("/:id/join", auth, joinCommunity);
router.delete("/:id", auth, deleteCommunity);

export default router;
