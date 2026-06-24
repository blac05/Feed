import {
  createPostService, getAllPostsService, getPaginatedPostsService,
  getFollowingPostsService, getPaginatedFollowingPostsService,
  getTrendingPostsService, getPostsByHashtagService, getTrendingHashtagsService,
  getPostByIdService, deletePostService, likePostService,
  reactToPostService, voteOnPollService, addCommentService, // <-- This will now work!
  getHeadlinesHotService, getHeadlinesNewService,
  getHeadlinesTopService, getHeadlinesRisingService,
  voteOnPostService, giveAwardService,
} from "../services/postService.js";

// ── Headlines Controller Methods ────────────────────────────

export const getHeadlinesHot = async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const result = await getHeadlinesHotService(req.user?._id, Number(page));
    res.json({ success: true, ...result });
  } catch (error) { next(error); }
};

export const getHeadlinesNew = async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const result = await getHeadlinesNewService(req.user?._id, Number(page));
    res.json({ success: true, ...result });
  } catch (error) { next(error); }
};

export const getHeadlinesTop = async (req, res, next) => {
  try {
    const { page = 1, period = "week" } = req.query;
    const result = await getHeadlinesTopService(req.user?._id, period, Number(page));
    res.json({ success: true, ...result });
  } catch (error) { next(error); }
};

export const getHeadlinesRising = async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const result = await getHeadlinesRisingService(req.user?._id, Number(page));
    res.json({ success: true, ...result });
  } catch (error) { next(error); }
};

export const voteOnPost = async (req, res, next) => {
  try {
    const post = await voteOnPostService(req.params.id, req.user._id, req.body.vote);
    res.json({ success: true, post });
  } catch (error) { next(error); }
};

export const giveAward = async (req, res, next) => {
  try {
    const post = await giveAwardService(req.params.id, req.user._id, req.body.awardType);
    res.json({ success: true, post });
  } catch (error) { next(error); }
};