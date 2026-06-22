import express from "express";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// ==========================================
// STATIC & SEARCH ROUTINES
// ==========================================

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

// Search history (stored in session — stateless, client manages)
router.get("/search/history", auth, async (req, res) => {
  // Search history is managed client-side in localStorage
  // This endpoint is a placeholder for future server-side history
  res.json({ success: true, history: [] });
});

// GET /api/users/me (Fetch current session profile)
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ success: true, user });
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

// GET /api/users/blocked (Must live above dynamic /:id parameter)
router.get("/blocked", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("blockedUsers", "username name avatar");
    res.json({ success: true, blocked: user.blockedUsers || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/users/muted (Must live above dynamic /:id parameter)
router.get("/muted", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("mutedUsers", "username name avatar");
    res.json({ success: true, muted: user.mutedUsers || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// DYNAMIC PROFILE INTERACTION LAYER
// ==========================================

// GET /api/users/:id (Fetch singular profile metrics)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/users/me (Update profile settings configuration)
router.put("/me", auth, async (req, res) => {
  try {
    const { username, name, bio, location, website, avatar, coverImage, pushNotifications } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, name, bio, location, website, avatar, coverImage, pushNotifications },
      { new: true, runValidators: true }
    ).select("-password");
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// SOCIAL GRAPH, MODERATION, & ENGAGEMENT
// ==========================================

// POST /api/users/:id/follow (Follow/Unfollow toggle)
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

// POST /api/users/:id/block (Block/Unblock + Bidirectional connection severing)
router.post("/:id/block", auth, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot block yourself" });
    }
    const currentUser = await User.findById(req.user._id);
    const isBlocked = currentUser.blockedUsers.includes(req.params.id);
    
    if (isBlocked) {
      currentUser.blockedUsers.pull(req.params.id);
    } else {
      currentUser.blockedUsers.push(req.params.id);
      
      // Clean up connections: Current user stops following target, target loses current user's follow
      currentUser.following.pull(req.params.id);
      currentUser.followers.pull(req.params.id);
      
      await User.findByIdAndUpdate(req.params.id, { 
        $pull: { 
          followers: req.user._id,
          following: req.user._id 
        } 
      });
    }
    
    await currentUser.save();
    res.json({ success: true, blocked: !isBlocked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/users/:id/mute (Mute/Unmute toggle)
router.post("/:id/mute", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const isMuted = currentUser.mutedUsers.includes(req.params.id);
    
    if (isMuted) {
      currentUser.mutedUsers.pull(req.params.id);
    } else {
      currentUser.mutedUsers.push(req.params.id);
    }
    
    await currentUser.save();
    res.json({ success: true, muted: !isMuted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/users/bookmark/:postId (Toggle post bookmark)
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

// People you may know — mutual followers algorithm
router.get("/suggestions/people", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id).select("following blockedUsers");
    const following = currentUser.following || [];
    const blocked = currentUser.blockedUsers || [];
    const excluded = [...following.map(id => id.toString()), req.user._id.toString(), ...blocked.map(id => id.toString())];

    // Find users that people you follow also follow
    const followingUsers = await User.find({ _id: { $in: following } }).select("following");
    const mutualCandidates = followingUsers.flatMap(u => u.following.map(id => id.toString()));

    // Count how many mutual connections each candidate has
    const scoreMap = {};
    mutualCandidates.forEach(id => {
      if (!excluded.includes(id)) {
        scoreMap[id] = (scoreMap[id] || 0) + 1;
      }
    });

    // Sort by score and get top candidates
    const sortedIds = Object.entries(scoreMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([id]) => id);

    let suggestions = [];
    if (sortedIds.length > 0) {
      suggestions = await User.find({ _id: { $in: sortedIds } })
        .select("username name avatar isVerified accountType followers bio")
        .lean();
      // Attach mutual count
      suggestions = suggestions.map(u => ({
        ...u,
        mutualCount: scoreMap[u._id.toString()] || 0,
      })).sort((a, b) => b.mutualCount - a.mutualCount);
    }

    // Pad with recent active users if not enough
    if (suggestions.length < 5) {
      const recent = await User.find({ _id: { $nin: [...excluded, ...sortedIds] } })
        .select("username name avatar isVerified accountType followers bio")
        .sort({ createdAt: -1 })
        .limit(8 - suggestions.length);
      suggestions = [...suggestions, ...recent];
    }

    res.json({ success: true, users: suggestions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
