import mongoose from "mongoose";

const schema =
new mongoose.Schema({

  user:{
    type:
      mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  interests:[
    String
  ]
});

export default mongoose.model(
  "UserPreference",
  schema
);
