const { readDb, writeDb } = require("../models/store.model");
const { publicUser } = require("../models/user.model");
const { readBody, sendJson } = require("../utils/http");

function getMe(req, res) {
  return sendJson(res, 200, { user: publicUser(req.user) });
}

async function updateMe(req, res) {
  const body = await readBody(req);
  const db = readDb();
  const user = db.users.find((item) => item.id === req.user.id);

  user.name = body.name || user.name;
  user.bio = body.bio ?? user.bio;
  user.avatarInitials = (body.avatarInitials || user.avatarInitials).slice(0, 2).toUpperCase();
  user.wallpaperUrl = body.wallpaperUrl ?? user.wallpaperUrl ?? "";

  writeDb(db);
  return sendJson(res, 200, { user: publicUser(user) });
}

module.exports = { getMe, updateMe };
