import {
  getTrendingPosts,
} from "../services/exploreService.js";

export const explore =
  async (req, res, next) => {
    try {
      const posts =
        await getTrendingPosts();

      res.json({
        success: true,
        posts,
      });
    } catch (error) {
      next(error);
    }
  };
