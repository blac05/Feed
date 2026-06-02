import {
  createPostService,
  getAllPostsService,
  getPostByIdService,
  deletePostService,
  likePostService,
} from "../services/postService.js";

export const createPost = async (
  req,
  res,
  next
) => {
  try {
    const post = await createPostService(
      req.user._id,
      req.body
    );

    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (
  req,
  res,
  next
) => {
  try {
    const posts =
      await getAllPostsService();

    res.json({
      success: true,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (
  req,
  res,
  next
) => {
  try {
    const post =
      await getPostByIdService(
        req.params.id
      );

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req,
  res,
  next
) => {
  try {
    await deletePostService(
      req.params.id,
      req.user._id.toString()
    );

    res.json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (
  req,
  res,
  next
) => {
  try {
    const post =
      await likePostService(
        req.params.id,
        req.user._id
      );

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};