import express from "express";
import auth from "../middleware/auth.js";

import {
  getNotifications,
  markAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get(
  "/",
  auth,
  getNotifications
);

router.put(
  "/:id/read",
  auth,
  markAsRead
);

export default router;