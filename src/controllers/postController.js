import {
  createPostService,
  getAllPostsService,
  getPaginatedPostsService,
  getFollowingPostsService,
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
  getHeadlinesHotService,
  getHeadlinesNewService,
  getHeadlinesTopService,
  getHeadlinesRisingService,
  voteOnPostService,
  giveAwardService,
} from "../services/postService.js";

// ── Headlines Controller Methods ────────────────────────────

export const getHeadlinesHot = async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const result = await getHeadlinesHotService(req.user?._id, Number(page));
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getHeadlinesNew = async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const result = await getHeadlinesNewService(req.user?._id, Number(page));
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getHeadlinesTop = async (req, res, next) => {
  try {
    const { page = 1, period = "week" } = req.query;
    const result = await getHeadlinesTopService(req.user?._id, period, Number(page));
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getHeadlinesRising = async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const result = await getHeadlinesRisingService(req.user?._id, Number(page));
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const voteOnPost = async (req, res, next) => {
  try {
    const post = await voteOnPostService(req.params.id, req.user._id, req.body.vote);
    res.json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

export const giveAward = async (req, res, next) => {
  try {
    const post = await giveAwardService(req.params.id, req.user._id, req.body.awardType);
    res.json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

// Additional Post Interactions

export const likePost = async (req, res, next) => {
  try {
    const post = await likePostService(req.params.id, req.user._id);
    res.json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

export const reactToPost = async (req, res, next) => {
  try {
    const { reactionType } = req.body;
    const post = await reactToPostService(req.params.id, req.user._id, reactionType);
    res.json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

export const voteOnPoll = async (req, res, next) => {
  try {
    const { optionId } = req.body;
    const post = await voteOnPollService(req.params.id, req.user._id, optionId);
    res.json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const post = await addCommentService(req.params.id, req.user._id, text);
    res.json({ success: true, post });
  } catch (error) {
    next(error);
  }
};