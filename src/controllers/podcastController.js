import Podcast from "../models/Podcast.js";
import PodcastEpisode from "../models/PodcastEpisode.js";

export const createPodcast =
async (req,res,next)=>{
  try{

    const podcast =
      await Podcast.create({

        ...req.body,

        creator:req.user._id
      });

    res.status(201).json({
      success:true,
      podcast
    });

  }catch(error){
    next(error);
  }
};

export const getPodcasts =
async (req,res,next)=>{
  try{

    const podcasts =
      await Podcast.find();

    res.json({
      success:true,
      podcasts
    });

  }catch(error){
    next(error);
  }
};

export const createEpisode =
async (req,res,next)=>{
  try{

    const episode =
      await PodcastEpisode.create(
        req.body
      );

    res.status(201).json({
      success:true,
      episode
    });

  }catch(error){
    next(error);
  }
};
