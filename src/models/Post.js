import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    image: { type: String, default: "" },
    video: { type: String, default: "" },
    mediaType: { type: String, enum: ["none", "image", "video"], default: "none" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    reactions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        type: { type: String, enum: ["like", "love", "haha", "wow", "sad", "angry"], default: "like" },
      },
    ],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    reposts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    quotedPost: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },
    poll: {
      question: { type: String, default: "" },
      options: [
        {
          text: { type: String },
          votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        },
      ],
      endsAt: { type: Date },
    },
    tags: [{ type: String }],
    type: {
      type: String,
      enum: ["post", "news", "update", "headline", "quote", "poll"],
      default: "post",
    },
    views: { type: Number, default: 0 },
    trendingScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

postSchema.pre("save", function (next) {
  const hashtagRegex = /#(\w+)/g;
  const matches = this.content.match(hashtagRegex);
  if (matches) {
    this.tags = [...new Set(matches.map(t => t.slice(1).toLowerCase()))];
  }
  if (this.image && !this.video) this.mediaType = "image";
  else if (this.video) this.mediaType = "video";
  else this.mediaType = "none";

  const hoursSinceCreated = (Date.now() - this.createdAt) / (1000 * 60 * 60);
  const decay = Math.pow(hoursSinceCreated + 2, 1.5);
  this.trendingScore = (this.likes.length * 3 + this.comments.length * 2 + this.reposts.length) / decay;
  next();
});

export default mongoose.model("Post", postSchema);
