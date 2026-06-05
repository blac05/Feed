import mongoose from "mongoose";

const schema =
new mongoose.Schema({

  user:{
    type:
      mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  fullName:String,

  documentUrl:String,

  status:{
    type:String,
    default:"pending"
  }
},
{
  timestamps:true
});

export default mongoose.model(
  "VerificationRequest",
  schema
);
