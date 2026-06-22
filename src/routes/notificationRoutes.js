import express from "express";
import auth from "../middleware/auth.js";
import {
  getNotifications, markAllRead, markOneRead,
  deleteNotification, clearAll,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", auth, getNotifications);
router.put("/read-all", auth, markAllRead);
router.put("/:id/read", auth, markOneRead);
router.delete("/clear-all", auth, clearAll);
router.delete("/:id", auth, deleteNotification);

export default router;
