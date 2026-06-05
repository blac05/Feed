import mongoose from "mongoose";

const banSchema =
new mongoose.Schema({

  user:{
    type:
      mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  reason:String,

  expiresAt:Date,

  active:{
    type:Boolean,
    default:true
  }
},
{
  timestamps:true
});

export default mongoose.model(
  "Ban",
  banSchema
);
