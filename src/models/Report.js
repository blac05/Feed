import mongoose from "mongoose";

const reportSchema =
new mongoose.Schema({

  reporter:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  targetId:String,

  targetType:{
    type:String,
    enum:[
      "post",
      "video",
      "story",
      "comment",
      "live",
      "user"
    ]
  },

  reason:String,

  status:{
    type:String,
    default:"pending"
  }
},
{
  timestamps:true
});

export default mongoose.model(
  "Report",
  reportSchema
);
