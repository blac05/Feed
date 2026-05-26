const { optionalAuth } = require("../middleware/auth.middleware");
const { listNotifications } = require("../controllers/notification.controller");

module.exports = [
  { method: "GET", pattern: /^\/api\/notifications$/, handler: optionalAuth(listNotifications) },
];
