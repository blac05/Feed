import Post from "../models/Post.js";
import User from "../models/User.js";
import { getIO } from "../sockets/socketServer.js";

export const createPostService = async (userId, data) => {
  const post = await Post.create({
    author: userId,
    content: data.content,
    image: data.image || "",
    type: data.type || "post",
    tags: data.tags || [],
  });
  return await Post.findById(post._id)
    .populate("author", "username name avatar isVerified accountType");
};

export const getAllPostsService = async () => {
  return await Post.find()
    .populate("author", "username name avatar isVerified accountType")
    .sort({ createdAt: -1 })
    .limit(50);
};

export const getFollowingPostsService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  return await Post.find({ author: { $in: [...user.following, userId] } })
    .populate("author", "username name avatar isVerified accountType")
    .sort({ createdAt: -1 })
    .limit(50);
};

export const getPostByIdService = async (id) => {
  return await Post.findById(id)
    .populate("author", "username name avatar isVerified accountType")
    .populate("comments.user", "username name avatar isVerified accountType");
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
          id: Date.now(),
          type: "like",
          user: "Someone",
          text: "liked your post",
          time: "Just now",
          read: false,
        });
      } catch (e) {}
    }
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
        id: Date.now(),
        type: "comment",
        user: "Someone",
        text: `commented: "${text.slice(0, 50)}"`,
        time: "Just now",
        read: false,
      });
    } catch (e) {}
  }

  return await Post.findById(postId)
    .populate("author", "username name avatar isVerified accountType")
    .populate("comments.user", "username name avatar isVerified accountType");
};
