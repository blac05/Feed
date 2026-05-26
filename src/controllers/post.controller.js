const { enrichPost } = require("../models/post.model");
const { readDb, writeDb } = require("../models/store.model");
const { readBody, sendJson } = require("../utils/http");
const { makeId } = require("../utils/security");

function listPosts(req, res) {
  const db = readDb();
  const posts = db.posts.map((post) => enrichPost(post, db)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return sendJson(res, 200, { posts });
}

async function createPost(req, res) {
  const body = await readBody(req);
  const db = readDb();
  if (!body.body) return sendJson(res, 400, { error: "Post body is required." });

  const post = {
    id: makeId("post"),
    authorId: req.user.id,
    area: body.area || "General",
    body: body.body,
    imageUrl: body.imageUrl || "",
    stats: [
      { value: "New", label: "community post" },
      { value: body.commentsRestricted ? "Limited" : "Open", label: "comments" },
      { value: "Live", label: "source status" },
    ],
    likes: 0,
    reposts: 0,
    shares: 0,
    commentsRestricted: Boolean(body.commentsRestricted),
    comments: [],
    createdAt: new Date().toISOString(),
  };

  db.posts.unshift(post);
  writeDb(db);
  return sendJson(res, 201, { post: enrichPost(post, db) });
}

function reactToPost(req, res) {
  const db = readDb();
  const post = db.posts.find((item) => item.id === req.params.postId);
  if (!post) return sendJson(res, 404, { error: "Post not found." });

  if (req.params.action === "like") post.likes += 1;
  if (req.params.action === "repost") post.reposts += 1;
  if (req.params.action === "share") post.shares += 1;

  writeDb(db);
  return sendJson(res, 200, { post: enrichPost(post, db) });
}

async function addComment(req, res) {
  const body = await readBody(req);
  const db = readDb();
  const post = db.posts.find((item) => item.id === req.params.postId);

  if (!post) return sendJson(res, 404, { error: "Post not found." });
  if (post.commentsRestricted) return sendJson(res, 403, { error: "Comments are restricted by the content owner." });

  post.comments.push({ id: makeId("comment"), userId: req.user.id, body: body.body, createdAt: new Date().toISOString() });
  writeDb(db);
  return sendJson(res, 201, { post: enrichPost(post, db) });
}

module.exports = { addComment, createPost, listPosts, reactToPost };
