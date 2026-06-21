import express from "express";
import auth from "../middleware/auth.js";
import {
  startLive, joinLive, getLives, getLive, endLive, leaveStream
} from "../controllers/liveController.js";

const router = express.Router();

router.get("/", getLives);
router.get("/:id", auth, getLive);
router.post("/start", auth, startLive);
router.get("/join/:id", auth, joinLive);
router.put("/end/:id", auth, endLive);
router.put("/leave/:id", auth, leaveStream);

export default router;
