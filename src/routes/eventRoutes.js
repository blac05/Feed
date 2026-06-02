import express from "express";

import auth from "../middleware/auth.js";

import {
  createEvent,
  getEvents,
  deleteEvent,
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/", getEvents);

router.post(
  "/",
  auth,
  createEvent
);

router.delete(
  "/:id",
  auth,
  deleteEvent
);

export default router;