import mongoose from "mongoose";

const communityMemberSchema =
new mongoose.Schema({

  community:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Community"
  },

  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  role:{
    type:String,
    enum:[
      "member",
      "moderator",
      "owner"
    ],
    default:"member"
  }

},{
  timestamps:true
});

export default mongoose.model(
  "CommunityMember",
  communityMemberSchema
);
