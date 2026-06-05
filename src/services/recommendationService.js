import Video from "../models/Video.js";
import Post from "../models/Post.js";

export const getForYouFeed =
async () => {

  const videos =
    await Video.find()
      .sort({
        likes:-1,
        views:-1
      })
      .limit(20);

  const posts =
    await Post.find()
      .sort({
        likes:-1
      })
      .limit(20);

  return {
    videos,
    posts
  };
};
