import express from "express";
import auth from "../middleware/auth.js";
import {
  buyTicket,
  myTickets
} from "../controllers/ticketController.js";

const router = express.Router();

router.post("/", auth, buyTicket);
router.get("/my", auth, myTickets);

export default router;
