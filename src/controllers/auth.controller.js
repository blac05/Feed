const { readDb, writeDb } = require("../models/store.model");
const { publicUser } = require("../models/user.model");
const { readBody, sendJson } = require("../utils/http");
const { hashPassword, makeCode, makeId } = require("../utils/security");

async function requestVerification(req, res) {
  const body = await readBody(req);
  const db = readDb();
  const emailCode = makeCode();
  const phoneCode = makeCode();

  db.verifications.push({
    email: body.email,
    phone: body.phone,
    emailCode,
    phoneCode,
    createdAt: new Date().toISOString(),
  });

  writeDb(db);
  return sendJson(res, 200, { message: "Verification codes created.", emailCode, phoneCode });
}

async function register(req, res) {
  const body = await readBody(req);
  const db = readDb();

  if (!body.name || !body.handle || !body.dateOfBirth || !body.email || !body.phone || !body.password) {
    return sendJson(res, 400, { error: "Name, handle, date of birth, email, phone, and password are required." });
  }

  const handle = body.handle.replace(/^@/, "");
  if (db.users.some((user) => user.email === body.email || user.handle === handle)) {
    return sendJson(res, 409, { error: "Email or handle already exists." });
  }

  const verification = db.verifications.find(
    (item) => item.email === body.email && item.phone === body.phone && item.emailCode === body.emailCode && item.phoneCode === body.phoneCode,
  );
  if (!verification) return sendJson(res, 400, { error: "Email or phone verification code is incorrect." });

  const user = {
    id: makeId("user"),
    name: body.name,
    handle,
    email: body.email,
    phone: body.phone,
    dateOfBirth: body.dateOfBirth,
    passwordHash: hashPassword(body.password),
    avatarInitials: body.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    wallpaperUrl: body.wallpaperUrl || "",
    bio: "New Feed member.",
    verified: false,
    followers: 0,
  };
  const token = makeId("token");

  db.users.push(user);
  db.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });
  writeDb(db);

  return sendJson(res, 201, { token, user: publicUser(user) });
}

module.exports = { register, requestVerification };
