import mongoose from "mongoose";

const podcastEpisodeSchema =
new mongoose.Schema({

  podcast:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Podcast"
  },

  title:String,

  description:String,

  audioUrl:String,

  duration:Number,

  views:{
    type:Number,
    default:0
  }

},{
  timestamps:true
});

export default mongoose.model(
  "PodcastEpisode",
  podcastEpisodeSchema
);
