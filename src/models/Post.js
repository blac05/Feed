import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    image: { type: String, default: "" },
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

    // Quote post
    quotedPost: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },

    // Poll
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

    // Hashtags extracted from content
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

// Auto-extract hashtags before saving
postSchema.pre("save", function (next) {
  const hashtagRegex = /#(\w+)/g;
  const matches = this.content.match(hashtagRegex);
  if (matches) {
    this.tags = [...new Set(matches.map(t => t.slice(1).toLowerCase()))];
  }
  // Update trending score
  const hoursSinceCreated = (Date.now() - this.createdAt) / (1000 * 60 * 60);
  const decay = Math.pow(hoursSinceCreated + 2, 1.5);
  this.trendingScore = (this.likes.length * 3 + this.comments.length * 2 + this.reposts.length) / decay;
  next();
});

export default mongoose.model("Post", postSchema);

