const { readDb } = require("../models/store.model");
const { sendJson } = require("../utils/http");

function getUserFromRequest(req) {
  const db = readDb();
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const session = db.sessions.find((item) => item.token === token);
  if (!session) return null;
  return db.users.find((user) => user.id === session.userId) || null;
}

function requireAuth(handler) {
  return (req, res) => {
    const user = getUserFromRequest(req);
    if (!user) return sendJson(res, 401, { error: "Create an account or sign in first." });
    req.user = user;
    return handler(req, res);
  };
}

function optionalAuth(handler) {
  return (req, res) => {
    req.user = getUserFromRequest(req);
    return handler(req, res);
  };
}

module.exports = { optionalAuth, requireAuth };
