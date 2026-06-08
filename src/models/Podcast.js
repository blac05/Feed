import mongoose from "mongoose";

const podcastSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: String,

  coverImage: String,

  subscribers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
},{
  timestamps:true
});

export default mongoose.model(
  "Podcast",
  podcastSchema
);
