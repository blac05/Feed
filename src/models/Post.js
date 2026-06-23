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
    
    // Content Moderation & AI Flag Isolation Toggle
    hidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes to speed up lookups for public feed aggregation engines
postSchema.index({ hidden: 1, author: 1, createdAt: -1 });
postSchema.index({ tags: 1, hidden: 1, createdAt: -1 });

postSchema.pre("save", function (next) {
  // 1. Regex parsing for continuous hashtag compilation
  const hashtagRegex = /#(\w+)/g;
  const matches = this.content.match(hashtagRegex);
  if (matches) {
    this.tags = [...new Set(matches.map(t => t.slice(1).toLowerCase()))];
  }

  // 2. Strict media state evaluation fallback
  if (this.image && !this.video) this.mediaType = "image";
  else if (this.video) this.mediaType = "video";
  else this.mediaType = "none";

  // 3. CRITICAL BUGFIX: Fallback to current system time if document is brand new
  const recordCreationTime = this.createdAt || new Date();
  const hoursSinceCreated = (Date.now() - recordCreationTime) / (1000 * 60 * 60);
  const decay = Math.pow(hoursSinceCreated + 2, 1.5);
  
  this.trendingScore = 
    ((this.likes?.length || 0) * 3 + (this.comments?.length || 0) * 2 + (this.reposts?.length || 0)) / decay;

  next();
});

export default mongoose.model("Post", postSchema);
