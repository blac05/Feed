import Post from "../models/Post.js";

export const createPostService = async (
  userId,
  data
) => {
  return await Post.create({
    author: userId,
    content: data.content,
    image: data.image || "",
  });
};

export const getAllPostsService = async () => {
  return await Post.find()
    .populate("author", "username avatar")
    .sort({ createdAt: -1 });
};

export const getPostByIdService = async (id) => {
  return await Post.findById(id)
    .populate("author", "username avatar");
};

export const deletePostService = async (
  postId,
  userId
) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.author.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  await Post.findByIdAndDelete(postId);
};

export const likePostService = async (
  postId,
  userId
) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  const alreadyLiked = post.likes.includes(userId);

  if (alreadyLiked) {
    post.likes.pull(userId);
  } else {
    post.likes.push(userId);
  }

  await post.save();

  return post;
};