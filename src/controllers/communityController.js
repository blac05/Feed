import Community from "../models/Community.js";
import CommunityPost from "../models/CommunityPost.js";
import CommunityMember from "../models/CommunityMember.js";

export const createCommunity =
async (req,res,next)=>{
  try{

    const community =
      await Community.create({

        ...req.body,

        owner:req.user._id
      });

    await CommunityMember.create({

      community:community._id,

      user:req.user._id,

      role:"owner"
    });

    res.status(201).json({
      success:true,
      community
    });

  }catch(error){
    next(error);
  }
};

export const getCommunities =
async (req,res,next)=>{
  try{

    const communities =
      await Community.find()
      .populate(
        "owner",
        "username avatar"
      );

    res.json({
      success:true,
      communities
    });

  }catch(error){
    next(error);
  }
};

export const joinCommunity =
async (req,res,next)=>{
  try{

    await CommunityMember.create({

      community:req.params.id,

      user:req.user._id
    });

    await Community.findByIdAndUpdate(
      req.params.id,
      {
        $inc:{
          membersCount:1
        }
      }
    );

    res.json({
      success:true,
      message:"Joined community"
    });

  }catch(error){
    next(error);
  }
};

export const createCommunityPost =
async (req,res,next)=>{
  try{

    const post =
      await CommunityPost.create({

        community:req.params.id,

        author:req.user._id,

        content:req.body.content,

        images:req.body.images
      });

    res.status(201).json({
      success:true,
      post
    });

  }catch(error){
    next(error);
  }
};

export const getCommunityPosts =
async (req,res,next)=>{
  try{

    const posts =
      await CommunityPost.find({

        community:req.params.id

      })
      .populate(
        "author",
        "username avatar"
      )
      .sort({
        createdAt:-1
      });

    res.json({
      success:true,
      posts
    });

  }catch(error){
    next(error);
  }
};
