import express from "express";

import auth from "../middleware/auth.js";

import {
  sendMessage,
  fetchMessages,
} from "../controllers/messageController.js";

const router =
  express.Router();

router.post(
  "/",
  auth,
  sendMessage
);

router.get(
  "/:id",
  auth,
  fetchMessages
);

export default router;
