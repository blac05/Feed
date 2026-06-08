import mongoose from "mongoose";

const sponsorshipSchema =
new mongoose.Schema({

  creator:{
    type:
      mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  brand:{
    type:
      mongoose.Schema.Types.ObjectId,
    ref:"Brand"
  },

  amount:Number,

  status:{
    type:String,
    default:"pending"
  }

},{
  timestamps:true
});

export default mongoose.model(
  "Sponsorship",
  sponsorshipSchema
);
