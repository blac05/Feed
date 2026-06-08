import mongoose from "mongoose";

const advertisementSchema =
new mongoose.Schema({

  campaign:{
    type:
      mongoose.Schema.Types.ObjectId,
    ref:"Campaign"
  },

  title:String,

  mediaUrl:String,

  destinationUrl:String,

  status:{
    type:String,
    default:"active"
  }

},{
  timestamps:true
});

export default mongoose.model(
  "Advertisement",
  advertisementSchema
);
