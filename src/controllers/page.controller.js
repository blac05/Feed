const { readDb, writeDb } = require("../models/store.model");
const { sendJson } = require("../utils/http");

function listPages(req, res) {
  const db = readDb();
  return sendJson(res, 200, { pages: db.pages });
}

function followPage(req, res) {
  const db = readDb();
  const page = db.pages.find((item) => item.id === req.params.pageId);
  if (!page) return sendJson(res, 404, { error: "Page not found." });

  if (!db.follows.some((item) => item.userId === req.user.id && item.pageId === page.id)) {
    db.follows.push({ userId: req.user.id, pageId: page.id, createdAt: new Date().toISOString() });
    page.followers += 1;
  }

  writeDb(db);
  return sendJson(res, 200, { page });
}

module.exports = { followPage, listPages };
