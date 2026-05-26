const { readDb } = require("../models/store.model");
const { sendJson } = require("../utils/http");

function listNotifications(req, res) {
  const db = readDb();
  const notifications = db.notifications.filter((item) => !item.userId || item.userId === req.user?.id);
  return sendJson(res, 200, { notifications });
}

module.exports = { listNotifications };
