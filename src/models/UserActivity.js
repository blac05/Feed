import mongoose from "mongoose";

const schema = new mongoose.Schema(
{
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  contentId:String,

  contentType:{
    type:String,
    enum:[
      "post",
      "video",
      "story",
      "live"
    ]
  },

  action:{
    type:String,
    enum:[
      "view",
      "like",
      "comment",
      "share",
      "follow"
    ]
  }
},
{
  timestamps:true
});

export default mongoose.model(
  "UserActivity",
  schema
);
