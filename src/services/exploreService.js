import Post from "../models/Post.js";

export const getTrendingPosts =
  async () => {
    return Post.find()
      .sort({
        likes: -1,
        createdAt: -1,
      })
      .limit(50)
      .populate(
        "author",
        "username avatar"
      );
  };
