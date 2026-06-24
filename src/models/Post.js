import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },

    // Headline fields
    title: { type: String, default: "" },
    flair: { type: String, default: "" },
    flairColor: { type: String, default: "" },
    community: { type: mongoose.Schema.Types.ObjectId, ref: "Community", default: null },
    communityName: { type: String, default: "" },
    sourceUrl: { type: String, default: "" },
    sourceDomain: { type: String, default: "" },
    readingTime: { type: Number, default: 0 }, // minutes
    isHeadline: { type: Boolean, default: false },

    // Voting (Reddit-style, separate from reactions)
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    voteScore: { type: Number, default: 0 }, // upvotes.length - downvotes.length
    hotScore: { type: Number, default: 0 },  // Wilson-inspired hot algorithm

    // Awards
    awards: [
      {
        type: { type: String, enum: ["gold", "silver", "platinum", "helpful", "wholesome", "rocket"] },
        givenBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        givenAt: { type: Date, default: Date.now },
      },
    ],

    // Media
    image: { type: String, default: "" },
    video: { type: String, default: "" },
    mediaType: { type: String, enum: ["none", "image", "video"], default: "none" },

    // Social
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
    hidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

postSchema.index({ hidden: 1, author: 1, createdAt: -1 });
postSchema.index({ tags: 1, hidden: 1, createdAt: -1 });
postSchema.index({ isHeadline: 1, hotScore: -1 });
postSchema.index({ isHeadline: 1, voteScore: -1 });

postSchema.pre("save", function (next) {
  // Hashtag extraction
  const hashtagRegex = /#(\w+)/g;
  const matches = this.content.match(hashtagRegex);
  if (matches) {
    this.tags = [...new Set(matches.map(t => t.slice(1).toLowerCase()))];
  }

  // Media type
  if (this.video) this.mediaType = "video";
  else if (this.image) this.mediaType = "image";
  else this.mediaType = "none";

  // Vote score
  this.voteScore = (this.upvotes?.length || 0) - (this.downvotes?.length || 0);

  // Hot score — Reddit-style Wilson algorithm
  const score = this.voteScore;
  const createdAt = this.createdAt || new Date();
  const epochSeconds = createdAt.getTime() / 1000;
  const order = Math.log10(Math.max(Math.abs(score), 1));
  const sign = score > 0 ? 1 : score < 0 ? -1 : 0;
  this.hotScore = sign * order + epochSeconds / 45000;

  // Trending score (legacy)
  const hoursSince = (Date.now() - createdAt) / (1000 * 60 * 60);
  const decay = Math.pow(hoursSince + 2, 1.5);
  this.trendingScore = ((this.likes?.length || 0) * 3 + (this.comments?.length || 0) * 2) / decay;

  // Source domain extraction
  if (this.sourceUrl && !this.sourceDomain) {
    try {
      this.sourceDomain = new URL(this.sourceUrl).hostname.replace("www.", "");
    } catch (e) {}
  }

  // Estimated reading time (words / 200 wpm)
  if (this.content) {
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.max(1, Math.ceil(wordCount / 200));
  }

  next();
});

export default mongoose.model("Post", postSchema);
