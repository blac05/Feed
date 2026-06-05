import mongoose from "mongoose";

const creatorStoreSchema =
  new mongoose.Schema(
    {
      creator: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      name: String,

      logo: String,

      banner: String,

      description: String,
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "CreatorStore",
  creatorStoreSchema
);
