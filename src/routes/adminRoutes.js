import express from "express";
import auth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
import {
  getStats, getUsers, verifyUser, banUser, unbanUser,
  makeAdmin, deleteUserPost, getRecentActivity,
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes require auth + adminAuth
router.use(auth, adminAuth);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.get("/activity", getRecentActivity);
router.put("/users/:id/verify", verifyUser);
router.put("/users/:id/ban", banUser);
router.put("/users/:id/unban", unbanUser);
router.put("/users/:id/make-admin", makeAdmin);
router.delete("/posts/:postId", deleteUserPost);

export default router;
