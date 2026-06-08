import mongoose from "mongoose";

const adAnalyticsSchema =
new mongoose.Schema({

  advertisement:{
    type:
      mongoose.Schema.Types.ObjectId,
    ref:"Advertisement"
  },

  impressions:{
    type:Number,
    default:0
  },

  clicks:{
    type:Number,
    default:0
  },

  conversions:{
    type:Number,
    default:0
  }

},{
  timestamps:true
});

export default mongoose.model(
  "AdAnalytics",
  adAnalyticsSchema
);
