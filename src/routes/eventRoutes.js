import express from "express";
import auth from "../middleware/auth.js";
import {
  getEvents, getEvent, createEvent, rsvpEvent, deleteEvent
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/", getEvents);
router.get("/:id", getEvent);
router.post("/", auth, createEvent);
router.post("/:id/rsvp", auth, rsvpEvent);
router.delete("/:id", auth, deleteEvent);

export default router;
