import mongoose from "mongoose";

const schema =
new mongoose.Schema({

  contentId:String,

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
  "AIReport",
  schema
);
