const crypto = require("crypto");

function makeId(prefix) {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
}

function makeCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

module.exports = { hashPassword, makeCode, makeId };
