import mongoose from "mongoose";

const communitySchema =
new mongoose.Schema({

  name:{
    type:String,
    required:true,
    unique:true
  },

  description:{
    type:String,
    required:true
  },

  banner:{
    type:String,
    default:""
  },

  avatar:{
    type:String,
    default:""
  },

  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  moderators:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }
  ],

  membersCount:{
    type:Number,
    default:0
  },

  rules:[
    String
  ],

  category:{
    type:String,
    default:"General"
  }

},{
  timestamps:true
});

export default mongoose.model(
  "Community",
  communitySchema
);
