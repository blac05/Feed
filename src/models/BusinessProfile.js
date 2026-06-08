import mongoose from "mongoose";

const businessProfileSchema =
new mongoose.Schema({

  owner:{
    type:
      mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  companyName:{
    type:String,
    required:true
  },

  website:String,

  logo:String,

  description:String,

  verified:{
    type:Boolean,
    default:false
  }

},{
  timestamps:true
});

export default mongoose.model(
  "BusinessProfile",
  businessProfileSchema
);
