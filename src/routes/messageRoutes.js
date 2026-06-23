import express from "express";
import auth from "../middleware/auth.js";
import {
  getMessages,
  sendMessage,
  deleteMessage,
  reactToMessage,
  searchMessages,
} from "../controllers/messageController.js";

const router = express.Router();

// 1. Search messages (CRITICAL: Must be placed BEFORE parametric routes like /:userId)
router.get("/search", auth, searchMessages);

// 2. Fetch conversational history between two users
router.get("/:userId", auth, getMessages);

// 3. Send a message
router.post("/", auth, sendMessage);

// 4. Soft-delete a specific message by its unique ID
router.delete("/:id", auth, deleteMessage);

// 5. Add or toggle emoji reactions on a message
router.post("/:id/react", auth, reactToMessage);

export default router;
