const fs = require("fs");
const path = require("path");
const { seedData } = require("./seed.model");

const DATA_DIR = path.join(__dirname, "..", "..", "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

function ensureDb() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify(seedData(), null, 2));
}

function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function writeDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

module.exports = { ensureDb, readDb, writeDb };
