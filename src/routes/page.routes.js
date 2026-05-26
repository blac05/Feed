const { requireAuth } = require("../middleware/auth.middleware");
const { listPages, followPage } = require("../controllers/page.controller");

module.exports = [
  { method: "GET", pattern: /^\/api\/pages$/, handler: listPages },
  { method: "POST", pattern: /^\/api\/pages\/(?<pageId>[^/]+)\/follow$/, handler: requireAuth(followPage) },
];
