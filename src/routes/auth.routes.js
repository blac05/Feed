const { requestVerification, register } = require("../controllers/auth.controller");

module.exports = [
  { method: "POST", pattern: /^\/api\/auth\/request-verification$/, handler: requestVerification },
  { method: "POST", pattern: /^\/api\/auth\/register$/, handler: register },
];
