import Community from "../models/Community.js";
import CommunityPost from "../models/CommunityPost.js";

export const createCommunity =
data =>
  Community.create(data);

export const getCommunities =
() =>
  Community.find()
  .populate(
    "owner",
    "username avatar"
  );

export const createPost =
data =>
  CommunityPost.create(data);

export const getCommunityPosts =
communityId =>
  CommunityPost.find({
    community:communityId
  })
  .populate(
    "author",
    "username avatar"
  )
  .sort({
    createdAt:-1
  });
