import mongoose from "mongoose";

const audioSpaceSchema =
new mongoose.Schema({

  host:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  title:String,

  description:String,

  isLive:{
    type:Boolean,
    default:true
  }

},{
  timestamps:true
});

export default mongoose.model(
  "AudioSpace",
  audioSpaceSchema
);
