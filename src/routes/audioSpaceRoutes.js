import express from "express";
import auth from "../middleware/auth.js";
import {
  createSpace,
  getSpaces
} from "../controllers/audioSpaceController.js";

const router = express.Router();

router.post("/", auth, createSpace);
router.get("/", getSpaces);

export default router;
