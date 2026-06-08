import mongoose from "mongoose";

const brandSchema =
new mongoose.Schema({

  business:{
    type:
      mongoose.Schema.Types.ObjectId,
    ref:"BusinessProfile"
  },

  name:String,

  category:String,

  logo:String,

  verified:{
    type:Boolean,
    default:false
  }

},{
  timestamps:true
});

export default mongoose.model(
  "Brand",
  brandSchema
);
