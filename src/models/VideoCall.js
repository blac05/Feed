import mongoose from "mongoose";

const videoCallSchema =
new mongoose.Schema({

  host:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  participants:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }
  ],

  roomId:String,

  active:{
    type:Boolean,
    default:true
  }

},{
  timestamps:true
});

export default mongoose.model(
  "VideoCall",
  videoCallSchema
);
