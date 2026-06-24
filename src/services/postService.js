// ── Headlines Feed Services ────────────────────────────────

export const getHeadlinesHotService = async (currentUserId, page = 1, limit = 20) => {
  let blocked = [];
  if (currentUserId) {
    const u = await User.findById(currentUserId).select("blockedUsers mutedUsers");
    blocked = [...(u?.blockedUsers || []), ...(u?.mutedUsers || [])];
  }
  const skip = (page - 1) * limit;
  const posts = await Post.find({ hidden: { $ne: true }, author: { $nin: blocked } })
    .populate("author", "username name avatar isVerified accountType")
    .populate("community", "name image category")
    .populate({ path: "quotedPost", populate: { path: "author", select: "username name avatar isVerified accountType" } })
    .sort({ hotScore: -1 })
    .skip(skip)
    .limit(limit);
  const total = await Post.countDocuments({ hidden: { $ne: true } });
  return { posts, hasMore: skip + posts.length < total };
};

export const getHeadlinesNewService = async (currentUserId, page = 1, limit = 20) => {
  let blocked = [];
  if (currentUserId) {
    const u = await User.findById(currentUserId).select("blockedUsers mutedUsers");
    blocked = [...(u?.blockedUsers || []), ...(u?.mutedUsers || [])];
  }
  const skip = (page - 1) * limit;
  const posts = await Post.find({ hidden: { $ne: true }, author: { $nin: blocked } })
    .populate("author", "username name avatar isVerified accountType")
    .populate("community", "name image category")
    .populate({ path: "quotedPost", populate: { path: "author", select: "username name avatar isVerified accountType" } })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const total = await Post.countDocuments({ hidden: { $ne: true } });
  return { posts, hasMore: skip + posts.length < total };
};

export const getHeadlinesTopService = async (currentUserId, period = "week", page = 1, limit = 20) => {
  let blocked = [];
  if (currentUserId) {
    const u = await User.findById(currentUserId).select("blockedUsers mutedUsers");
    blocked = [...(u?.blockedUsers || []), ...(u?.mutedUsers || [])];
  }
  const periodMap = { day: 1, week: 7, month: 30, year: 365, all: 36500 };
  const days = periodMap[period] || 7;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const skip = (page - 1) * limit;
  const posts = await Post.find({
    hidden: { $ne: true },
    author: { $nin: blocked },
    createdAt: { $gte: since },
  })
    .populate("author", "username name avatar isVerified accountType")
    .populate("community", "name image category")
    .populate({ path: "quotedPost", populate: { path: "author", select: "username name avatar isVerified accountType" } })
    .sort({ voteScore: -1, "comments.length": -1 })
    .skip(skip)
    .limit(limit);
  const total = await Post.countDocuments({ hidden: { $ne: true }, createdAt: { $gte: since } });
  return { posts, hasMore: skip + posts.length < total };
};

export const getHeadlinesRisingService = async (currentUserId, page = 1, limit = 20) => {
  let blocked = [];
  if (currentUserId) {
    const u = await User.findById(currentUserId).select("blockedUsers mutedUsers");
    blocked = [...(u?.blockedUsers || []), ...(u?.mutedUsers || [])];
  }
  // Rising = posts from last 6 hours sorted by velocity (upvotes per hour)
  const since = new Date(Date.now() - 6 * 60 * 60 * 1000);
  const skip = (page - 1) * limit;
  const posts = await Post.find({
    hidden: { $ne: true },
    author: { $nin: blocked },
    createdAt: { $gte: since },
  })
    .populate("author", "username name avatar isVerified accountType")
    .populate("community", "name image category")
    .lean();

  const scored = posts.map(p => {
    const ageHours = Math.max(0.1, (Date.now() - new Date(p.createdAt)) / (1000 * 60 * 60));
    const velocity = (p.upvotes?.length || 0) / ageHours;
    return { ...p, velocity };
  }).sort((a, b) => b.velocity - a.velocity);

  return {
    posts: scored.slice(skip, skip + limit),
    hasMore: skip + limit < scored.length,
  };
};

export const voteOnPostService = async (postId, userId, voteType) => {
  // voteType: 'up' | 'down' | null (remove vote)
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");

  // Remove from both
  post.upvotes = post.upvotes.filter(id => id.toString() !== userId.toString());
  post.downvotes = post.downvotes.filter(id => id.toString() !== userId.toString());

  if (voteType === "up") post.upvotes.push(userId);
  if (voteType === "down") post.downvotes.push(userId);

  await post.save();
  return await Post.findById(postId)
    .populate("author", "username name avatar isVerified accountType")
    .populate("community", "name image category");
};

export const giveAwardService = async (postId, userId, awardType) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");
  post.awards.push({ type: awardType, givenBy: userId });
  await post.save();
  return post;
};

