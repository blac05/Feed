import Post from "../models/Post.js";
import User from "../models/User.js";
import { getIO } from "../sockets/socketServer.js";

export const createPostService = async (userId, data) => {
  const postData = {
    author: userId,
    content: data.content,
    image: data.image || "",
    type: data.type || "post",
  };

  // Quote post
  if (data.quotedPostId) {
    postData.quotedPost = data.quotedPostId;
    postData.type = "quote";
  }

  // Poll
  if (data.poll && data.poll.options?.length >= 2) {
    postData.poll = {
      question: data.poll.question,
      options: data.poll.options.map(opt => ({ text: opt, votes: [] })),
      endsAt: new Date(Date.now() + (data.poll.duration || 24) * 60 * 60 * 1000),
    };
    postData.type = "poll";
  }

  const post = await Post.create(postData);
  return await Post.findById(post._id)
    .populate("author", "username name avatar isVerified accountType")
    .populate({
      path: "quotedPost",
      populate: { path: "author", select: "username name avatar isVerified accountType" },
    });
};

export const getAllPostsService = async () => {
  return await Post.find()
    .populate("author", "username name avatar isVerified accountType")
    .populate({
      path: "quotedPost",
      populate: { path: "author", select: "username name avatar isVerified accountType" },
    })
    .sort({ createdAt: -1 })
    .limit(50);
};

export const getTrendingPostsService = async () => {
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000); // last 48hrs
  const posts = await Post.find({ createdAt: { $gte: since } })
    .populate("author", "username name avatar isVerified accountType")
    .populate({
      path: "quotedPost",
      populate: { path: "author", select: "username name avatar isVerified accountType" },
    })
    .lean();

  // Calculate trending score in JS
  return posts
    .map(p => {
      const hoursSince = (Date.now() - new Date(p.createdAt)) / (1000 * 60 * 60);
      const decay = Math.pow(hoursSince + 2, 1.5);
      const score = (p.likes.length * 3 + p.comments.length * 2 + p.reposts.length) / decay;
      return { ...p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
};

export const getPostsByHashtagService = async (tag) => {
  return await Post.find({ tags: tag.toLowerCase() })
    .populate("author", "username name avatar isVerified accountType")
    .populate({
      path: "quotedPost",
      populate: { path: "author", select: "username name avatar isVerified accountType" },
    })
    .sort({ createdAt: -1 })
    .limit(50);
};

export const getTrendingHashtagsService = async () => {
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const posts = await Post.find({ createdAt: { $gte: since }, tags: { $exists: true, $ne: [] } }).lean();
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

export const getFollowingPostsService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  return await Post.find({ author: { $in: [...user.following, userId] } })
    .populate("author", "username name avatar isVerified accountType")
    .populate({
      path: "quotedPost",
      populate: { path: "author", select: "username name avatar isVerified accountType" },
    })
    .sort({ createdAt: -1 })
    .limit(50);
};

export const getPostByIdService = async (id) => {
  return await Post.findById(id)
    .populate("author", "username name avatar isVerified accountType")
    .populate("comments.user", "username name avatar isVerified accountType")
    .populate({
      path: "quotedPost",
      populate: { path: "author", select: "username name avatar isVerified accountType" },
    });
};

export const deletePostService = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");
  if (post.author.toString() !== userId) throw new Error("Unauthorized");
  await Post.findByIdAndDelete(postId);
};

export const likePostService = async (postId, userId) => {
  const post = await Post.findById(postId)
    .populate("author", "username name avatar isVerified accountType");
  if (!post) throw new Error("Post not found");
  const alreadyLiked = post.likes.includes(userId);
  if (alreadyLiked) {
    post.likes.pull(userId);
  } else {
    post.likes.push(userId);
    if (post.author._id.toString() !== userId.toString()) {
      try {
        const io = getIO();
        io.to(post.author._id.toString()).emit("notification", {
          id: Date.now(), type: "like", user: "Someone",
          text: "liked your post", time: "Just now", read: false,
        });
      } catch (e) {}
    }
  }
  await post.save();
  return await Post.findById(postId)
    .populate("author", "username name avatar isVerified accountType");
};

export const reactToPostService = async (postId, userId, reactionType) => {
  const post = await Post.findById(postId)
    .populate("author", "username name avatar isVerified accountType");
  if (!post) throw new Error("Post not found");
  post.reactions = post.reactions.filter(r => r.user.toString() !== userId.toString());
  post.likes = post.likes.filter(id => id.toString() !== userId.toString());
  if (reactionType) {
    post.reactions.push({ user: userId, type: reactionType });
    post.likes.push(userId);
    if (post.author._id.toString() !== userId.toString()) {
      try {
        const io = getIO();
        io.to(post.author._id.toString()).emit("notification", {
          id: Date.now(), type: "like", user: "Someone",
          text: "reacted to your post", time: "Just now", read: false,
        });
      } catch (e) {}
    }
  }
  await post.save();
  return await Post.findById(postId)
    .populate("author", "username name avatar isVerified accountType");
};

export const voteOnPollService = async (postId, userId, optionIndex) => {
  const post = await Post.findById(postId);
  if (!post?.poll) throw new Error("Post has no poll");
  if (new Date() > post.poll.endsAt) throw new Error("Poll has ended");

  // Remove previous votes from all options
  post.poll.options.forEach(opt => {
    opt.votes = opt.votes.filter(v => v.toString() !== userId.toString());
  });

  // Add vote to selected option
  if (post.poll.options[optionIndex]) {
    post.poll.options[optionIndex].votes.push(userId);
  }

  await post.save();
  return await Post.findById(postId)
    .populate("author", "username name avatar isVerified accountType");
};

export const addCommentService = async (postId, userId, text) => {
  const post = await Post.findById(postId)
    .populate("author", "username name avatar isVerified accountType");
  if (!post) throw new Error("Post not found");
  post.comments.push({ user: userId, text });
  await post.save();
  if (post.author._id.toString() !== userId.toString()) {
    try {
      const io = getIO();
      io.to(post.author._id.toString()).emit("notification", {
        id: Date.now(), type: "comment", user: "Someone",
        text: `commented: "${text.slice(0, 50)}"`, time: "Just now", read: false,
      });
    } catch (e) {}
  }
  return await Post.findById(postId)
    .populate("author", "username name avatar isVerified accountType")
    .populate("comments.user", "username name avatar isVerified accountType");
};
