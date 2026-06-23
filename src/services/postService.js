import Post from "../models/Post.js";
import User from "../models/User.js";
import { getIO } from "../sockets/socketServer.js";
import { createNotification } from "../controllers/notificationController.js";
import { sendPushToUser } from "../controllers/pushController.js";

// Shared population projection string for user credits
const AUTHOR_POPULATE_FIELDS = "username name avatar isVerified accountType";

// ==========================================
// MODERATION FILTER COMPLIANCE HELPER
// ==========================================
const getBlockedAndMutedUsers = async (currentUserId) => {
  if (!currentUserId) return [];
  const u = await User.findById(currentUserId).select("blockedUsers mutedUsers").lean();
  return [...(u?.blockedUsers || []), ...(u?.mutedUsers || [])];
};

// ==========================================
// POST MANAGEMENT & CREATION
// ==========================================

export const createPostService = async (userId, data) => {
  const postData = {
    author: userId,
    content: data.content,
    image: data.image || "",
    video: data.video || "",
    type: data.type || "post",
  };

  if (data.quotedPostId) {
    postData.quotedPost = data.quotedPostId;
    postData.type = "quote";
  }

  if (data.poll && data.poll.options?.length >= 2) {
    postData.poll = {
      question: data.poll.question,
      options: data.poll.options.map(opt => ({ text: opt, votes: [] })),
      endsAt: new Date(Date.now() + (data.poll.duration || 24) * 60 * 60 * 1000),
    };
    postData.type = "poll";
  }

  const post = await Post.create(postData);
  return await post.populate([
    { path: "author", select: AUTHOR_POPULATE_FIELDS },
    {
      path: "quotedPost",
      populate: { path: "author", select: AUTHOR_POPULATE_FIELDS },
    }
  ]);
};

export const deletePostService = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");
  if (post.author.toString() !== userId) throw new Error("Unauthorized");
  await Post.findByIdAndDelete(postId);
};

// ==========================================
// PAGINATED FEED AGGREGATIONS (MODERATED)
// ==========================================

export const getPaginatedPostsService = async (currentUserId, page = 1, limit = 15) => {
  const blockedUsers = await getBlockedAndMutedUsers(currentUserId);
  const skip = (page - 1) * limit;

  const posts = await Post.find({ author: { $nin: blockedUsers } })
    .populate("author", AUTHOR_POPULATE_FIELDS)
    .populate({ 
      path: "quotedPost", 
      populate: { path: "author", select: AUTHOR_POPULATE_FIELDS } 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Post.countDocuments({ author: { $nin: blockedUsers } });
  return { posts, hasMore: skip + posts.length < total, total };
};

export const getPaginatedFollowingPostsService = async (userId, page = 1, limit = 15) => {
  const user = await User.findById(userId).select("following").lean();
  if (!user) throw new Error("User not found");

  const blockedUsers = await getBlockedAndMutedUsers(userId);
  const skip = (page - 1) * limit;
  const targetAuthors = [...(user.following || []), userId];

  const posts = await Post.find({ 
    author: { 
      $in: targetAuthors, 
      $nin: blockedUsers 
    } 
  })
    .populate("author", AUTHOR_POPULATE_FIELDS)
    .populate({ 
      path: "quotedPost", 
      populate: { path: "author", select: AUTHOR_POPULATE_FIELDS } 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Post.countDocuments({ 
    author: { 
      $in: targetAuthors, 
      $nin: blockedUsers 
    } 
  });
  
  return { posts, hasMore: skip + posts.length < total, total };
};

// ==========================================
// LEGACY FEED RETRIEVAL ARRAYS (UNPAGINATED)
// ==========================================

export const getAllPostsService = async (currentUserId) => {
  const blockedUsers = await getBlockedAndMutedUsers(currentUserId);

  return await Post.find({ author: { $nin: blockedUsers } })
    .populate("author", AUTHOR_POPULATE_FIELDS)
    .populate({
      path: "quotedPost",
      populate: { path: "author", select: AUTHOR_POPULATE_FIELDS },
    })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
};

export const getFollowingPostsService = async (userId) => {
  const user = await User.findById(userId).select("following").lean();
  if (!user) throw new Error("User not found");

  const blockedUsers = await getBlockedAndMutedUsers(userId);
  const targetedFeedAuthors = [...(user.following || []), userId].filter(id => !blockedUsers.includes(id));

  return await Post.find({ author: { $in: targetedFeedAuthors } })
    .populate("author", AUTHOR_POPULATE_FIELDS)
    .populate({
      path: "quotedPost",
      populate: { path: "author", select: AUTHOR_POPULATE_FIELDS },
    })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
};

// ==========================================
// TRENDING & DISCOVERY UTILITIES
// ==========================================

export const getTrendingPostsService = async (currentUserId) => {
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const blockedUsers = await getBlockedAndMutedUsers(currentUserId);

  const posts = await Post.find({ 
    createdAt: { $gte: since },
    author: { $nin: blockedUsers }
  })
    .populate("author", AUTHOR_POPULATE_FIELDS)
    .populate({
      path: "quotedPost",
      populate: { path: "author", select: AUTHOR_POPULATE_FIELDS },
    })
    .lean();

  return posts
    .map(p => {
      const hoursSince = (Date.now() - new Date(p.createdAt)) / (1000 * 60 * 60);
      const decay = Math.pow(hoursSince + 2, 1.5);
      const score = ((p.likes?.length || 0) * 3 + (p.comments?.length || 0) * 2 + (p.reposts?.length || 0)) / decay;
      return { ...p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
};

export const getPostsByHashtagService = async (tag, currentUserId) => {
  const blockedUsers = await getBlockedAndMutedUsers(currentUserId);

  return await Post.find({ 
    tags: tag.toLowerCase(),
    author: { $nin: blockedUsers }
  })
    .populate("author", AUTHOR_POPULATE_FIELDS)
    .populate({
      path: "quotedPost",
      populate: { path: "author", select: AUTHOR_POPULATE_FIELDS },
    })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
};

export const getTrendingHashtagsService = async () => {
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const posts = await Post.find({ createdAt: { $gte: since }, tags: { $exists: true, $ne: [] } }).select("tags").lean();
  
  const tagCounts = {};
  posts.forEach(p => {
    (p.tags || []).forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  return Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));
};

export const getPostByIdService = async (id) => {
  return await Post.findById(id)
    .populate("author", AUTHOR_POPULATE_FIELDS)
    .populate("comments.user", AUTHOR_POPULATE_FIELDS)
    .populate({
      path: "quotedPost",
      populate: { path: "author", select: AUTHOR_POPULATE_FIELDS },
    });
};

// ==========================================
// ENGAGEMENT & NOTIFICATION PIPELINES
// ==========================================

export const likePostService = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");
  
  const actingUser = await User.findById(userId).select("username name").lean();
  const actorName = actingUser?.name || actingUser?.username || "Someone";
  const alreadyLiked = post.likes.includes(userId);
  
  if (alreadyLiked) {
    post.likes.pull(userId);
  } else {
    post.likes.push(userId);
    
    // Check to ensure the user isn't liking their own post
    if (post.author.toString() !== userId.toString()) {
      // 1. Database Persistent Audit Log
      createNotification({
        recipient: post.author,
        sender: userId,
        type: "like",
        text: "liked your post",
        postId: post._id,
        link: `/post/${post._id}`,
      }).catch(() => {});

      // 2. Real-Time WebSocket Event Dispatch
      try {
        const io = getIO();
        io.to(post.author.toString()).emit("notification", {
          id: Date.now(), 
          type: "like", 
          user: actorName,
          text: "liked your post", 
          time: "Just now", 
          read: false,
        });
      } catch (e) {}

      // 3. Native Operating System Push Delivery (Non-Blocking)
      sendPushToUser(post.author, {
        title: "New Like on Feed",
        body: `${actorName} liked your post`,
        icon: "/logo.png",
        url: `/post/${post._id}`,
      }).catch(() => {});
    }
  }
  
  await post.save();
  return await post.populate("author", AUTHOR_POPULATE_FIELDS);
};

export const reactToPostService = async (postId, userId, reactionType) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");
  
  const actingUser = await User.findById(userId).select("username name").lean();
  const actorName = actingUser?.name || actingUser?.username || "Someone";
  
  post.reactions = post.reactions.filter(r => r.user.toString() !== userId.toString());
  post.likes = post.likes.filter(id => id.toString() !== userId.toString());
  
  if (reactionType) {
    post.reactions.push({ user: userId, type: reactionType });
    post.likes.push(userId);
    
    if (post.author.toString() !== userId.toString()) {
      createNotification({
        recipient: post.author,
        sender: userId,
        type: "like",
        text: `reacted with ${reactionType} to your post`,
        postId: post._id,
        link: `/post/${post._id}`,
      }).catch(() => {});

      try {
        const io = getIO();
        io.to(post.author.toString()).emit("notification", {
          id: Date.now(), 
          type: "like", 
          user: actorName,
          text: `reacted with ${reactionType} to your post`, 
          time: "Just now", 
          read: false,
        });
      } catch (e) {}

      sendPushToUser(post.author, {
        title: "New Reaction on Feed",
        body: `${actorName} reacted with ${reactionType} to your post`,
        icon: "/logo.png",
        url: `/post/${post._id}`,
      }).catch(() => {});
    }
  }
  
  await post.save();
  return await post.populate("author", AUTHOR_POPULATE_FIELDS);
};

export const voteOnPollService = async (postId, userId, optionIndex) => {
  const post = await Post.findById(postId);
  if (!post?.poll) throw new Error("Post has no poll");
  if (new Date() > post.poll.endsAt) throw new Error("Poll has ended");

  post.poll.options.forEach(opt => {
    opt.votes = opt.votes.filter(v => v.toString() !== userId.toString());
  });

  if (post.poll.options[optionIndex]) {
    post.poll.options[optionIndex].votes.push(userId);
  }

  await post.save();
  return await post.populate("author", AUTHOR_POPULATE_FIELDS);
};

export const addCommentService = async (postId, userId, text) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");
  
  const actingUser = await User.findById(userId).select("username name").lean();
  const actorName = actingUser?.name || actingUser?.username || "Someone";
  
  post.comments.push({ user: userId, text });
  await post.save();
  
  if (post.author.toString() !== userId.toString()) {
    // 1. Database Persistent Audit Log
    createNotification({
      recipient: post.author,
      sender: userId,
      type: "comment",
      text: `commented: "${text.slice(0, 60)}"`,
      postId: post._id,
      link: `/post/${post._id}`,
    }).catch(() => {});

    // 2. Real-Time WebSocket Event Dispatch
    try {
      const io = getIO();
      io.to(post.author.toString()).emit("notification", {
        id: Date.now(), 
        type: "comment", 
        user: actorName,
        text: `commented: "${text.slice(0, 40)}..."`, 
        time: "Just now", 
        read: false,
      });
    } catch (e) {}

    // 3. Native Operating System Push Delivery (Non-Blocking)
    sendPushToUser(post.author, {
      title: "New Comment on Feed",
      body: `${actorName} commented: "${text.slice(0, 60)}"`,
      icon: "/logo.png",
      url: `/post/${post._id}`,
    }).catch(() => {});
  }
  
  return await post.populate([
    { path: "author", select: AUTHOR_POPULATE_FIELDS },
    { path: "comments.user", select: AUTHOR_POPULATE_FIELDS }
  ]);
};
