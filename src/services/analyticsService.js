import User from "../models/User.js";
import Post from "../models/Post.js";
import Video from "../models/Video.js";

export const getPlatformStats =
async ()=>{

  const users =
    await User.countDocuments();

  const posts =
    await Post.countDocuments();

  const videos =
    await Video.countDocuments();

  return {
    users,
    posts,
    videos
  };
};
