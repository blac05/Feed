import express from "express";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Search users
router.get("/search", auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, users: [] });
    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
      ],
    }).select("-password").limit(10);
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/me", auth, async (req, res) => {
  try {
    const { username, name, bio, location, website, avatar, coverImage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, name, bio, location, website, avatar, coverImage },
      { new: true, runValidators: true }
    ).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id/follow", auth, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);
    if (!userToFollow) return res.status(404).json({ message: "User not found" });
    const isFollowing = currentUser.following.includes(req.params.id);
    if (isFollowing) {
      currentUser.following.pull(req.params.id);
      userToFollow.followers.pull(req.user._id);
    } else {
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user._id);
    }
    await currentUser.save();
    await userToFollow.save();
    res.json({ success: true, following: !isFollowing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/users/bookmark/:postId
router.post("/bookmark/:postId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const postId = req.params.postId;
    const isBookmarked = user.bookmarks.includes(postId);
    if (isBookmarked) {
      user.bookmarks.pull(postId);
    } else {
      user.bookmarks.push(postId);
    }
    await user.save();
    res.json({ success: true, bookmarked: !isBookmarked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/users/bookmarks
router.get("/bookmarks", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "bookmarks",
      populate: { path: "author", select: "username name avatar isVerified accountType" },
      options: { sort: { createdAt: -1 } },
    });
    res.json({ success: true, bookmarks: user.bookmarks || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
