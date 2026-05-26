const { readDb, writeDb } = require("../models/store.model");
const { sendJson } = require("../utils/http");

function listEvents(req, res) {
  const db = readDb();
  return sendJson(res, 200, { events: db.events });
}

function updateEventInterest(req, res) {
  const db = readDb();
  const event = db.events.find((item) => item.id === req.params.eventId);
  if (!event) return sendJson(res, 404, { error: "Event not found." });

  if (req.params.action === "tickets") event.ticketInterest += 1;
  if (req.params.action === "updates") event.updateSubscribers += 1;

  writeDb(db);
  return sendJson(res, 200, { event });
}

module.exports = { listEvents, updateEventInterest };
