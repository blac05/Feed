import express from "express";
import auth from "../middleware/auth.js";
import {
  createSpace, getSpaces, getSpace,
  joinSpace, endSpace, raiseHand, inviteSpeaker,
} from "../controllers/audioSpaceController.js";

const router = express.Router();

router.get("/", getSpaces);
router.get("/:id", getSpace);
router.post("/", auth, createSpace);
router.post("/:id/join", auth, joinSpace);
router.put("/:id/end", auth, endSpace);
router.post("/:id/raise-hand", auth, raiseHand);
router.post("/:id/invite-speaker", auth, inviteSpeaker);

export default router;
