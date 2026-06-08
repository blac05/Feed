import mongoose from "mongoose";

const participantSchema =
new mongoose.Schema({

  space:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"AudioSpace"
  },

  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  role:{
    type:String,
    enum:[
      "listener",
      "speaker",
      "host"
    ],
    default:"listener"
  }

},{
  timestamps:true
});

export default mongoose.model(
  "SpaceParticipant",
  participantSchema
);
