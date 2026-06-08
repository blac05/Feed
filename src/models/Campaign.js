import mongoose from "mongoose";

const campaignSchema =
new mongoose.Schema({

  brand:{
    type:
      mongoose.Schema.Types.ObjectId,
    ref:"Brand"
  },

  title:String,

  budget:Number,

  impressions:{
    type:Number,
    default:0
  },

  clicks:{
    type:Number,
    default:0
  },

  status:{
    type:String,
    default:"active"
  }

},{
  timestamps:true
});

export default mongoose.model(
  "Campaign",
  campaignSchema
);
