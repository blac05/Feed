const { requireAuth } = require("../middleware/auth.middleware");
const { listPosts, createPost, reactToPost, addComment } = require("../controllers/post.controller");

module.exports = [
  { method: "GET", pattern: /^\/api\/posts$/, handler: listPosts },
  { method: "POST", pattern: /^\/api\/posts$/, handler: requireAuth(createPost) },
  { method: "POST", pattern: /^\/api\/posts\/(?<postId>[^/]+)\/(?<action>like|repost|share)$/, handler: reactToPost },
  { method: "POST", pattern: /^\/api\/posts\/(?<postId>[^/]+)\/comments$/, handler: requireAuth(addComment) },
];
