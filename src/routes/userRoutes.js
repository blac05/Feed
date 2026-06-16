import express from "express";
import User from "../models/User.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// GET /api/users/:id — public profile
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/users/me — logged in user's own profile
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/users/me — update profile
router.put("/me", protect, async (req, res) => {
  try {
    const { username, bio, location, website, avatar, coverImage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, bio, location, website, avatar, coverImage },
      { new: true, runValidators: true }
    ).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;