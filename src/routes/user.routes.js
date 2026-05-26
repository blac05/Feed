const { requireAuth } = require("../middleware/auth.middleware");
const { getMe, updateMe } = require("../controllers/user.controller");

module.exports = [
  { method: "GET", pattern: /^\/api\/me$/, handler: requireAuth(getMe) },
  { method: "PATCH", pattern: /^\/api\/me$/, handler: requireAuth(updateMe) },
];
