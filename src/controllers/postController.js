import {
  createPostService,
  getPaginatedPostsService,
  getPaginatedFollowingPostsService,
  getTrendingPostsService,
  getPostsByHashtagService,
  getTrendingHashtagsService,
  getPostByIdService,
  deletePostService,
  likePostService,
  reactToPostService,
  voteOnPollService,
  addCommentService,
} from "../services/postService.js";

export const createPost = async (req, res, next) => {
  try {
    const post = await createPostService(req.user._id, req.body);
    res.status(201).json({ success: true, post });
  } catch (error) { next(error); }
};

export const getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 15 } = req.query;
    const result = await getPaginatedPostsService(req.user?._id, Number(page), Number(limit));
    res.json({ success: true, ...result });
  } catch (error) { next(error); }
};

export const getFollowingPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 15 } = req.query;
    const result = await getPaginatedFollowingPostsService(req.user._id, Number(page), Number(limit));
    res.json({ success: true, ...result });
  } catch (error) { next(error); }
};

export const getTrendingPosts = async (req, res, next) => {
  try {
    // Retained req.user?._id safety check to filter blocked/muted accounts from trending feeds
    const posts = await getTrendingPostsService(req.user?._id);
    res.json({ success: true, posts });
  } catch (error) { next(error); }
};

export const getHashtagPosts = async (req, res, next) => {
  try {
    // Retained req.user?._id safety check to filter blocked/muted accounts from hashtag searches
    const posts = await getPostsByHashtagService(req.params.tag, req.user?._id);
    res.json({ success: true, posts, tag: req.params.tag });
  } catch (error) { next(error); }
};

export const getTrendingHashtags = async (req, res, next) => {
  try {
    const hashtags = await getTrendingHashtagsService();
    res.json({ success: true, hashtags });
  } catch (error) { next(error); }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await getPostByIdService(req.params.id);
    res.json({ success: true, post });
  } catch (error) { next(error); }
};

export const deletePost = async (req, res, next) => {
  try {
    await deletePostService(req.params.id, req.user._id.toString());
    res.json({ success: true, message: "Post deleted" });
  } catch (error) { next(error); }
};

export const likePost = async (req, res, next) => {
  try {
    const post = await likePostService(req.params.id, req.user._id);
    res.json({ success: true, post });
  } catch (error) { next(error); }
};

export const reactToPost = async (req, res, next) => {
  try {
    const post = await reactToPostService(req.params.id, req.user._id, req.body.type);
    res.json({ success: true, post });
  } catch (error) { next(error); }
};

export const voteOnPoll = async (req, res, next) => {
  try {
    const post = await voteOnPollService(req.params.id, req.user._id, req.body.optionIndex);
    res.json({ success: true, post });
  } catch (error) { next(error); }
};

export const addComment = async (req, res, next) => {
  try {
    const post = await addCommentService(req.params.id, req.user._id, req.body.text);
    res.json({ success: true, post });
  } catch (error) { next(error); }
};