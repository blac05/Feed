const { requireAuth } = require("../middleware/auth.middleware");
const { listEvents, updateEventInterest } = require("../controllers/event.controller");

module.exports = [
  { method: "GET", pattern: /^\/api\/events$/, handler: listEvents },
  { method: "POST", pattern: /^\/api\/events\/(?<eventId>[^/]+)\/(?<action>tickets|updates)$/, handler: requireAuth(updateEventInterest) },
];
