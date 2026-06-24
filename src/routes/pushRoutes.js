import express from "express";
import auth from "../middleware/auth.js";
import { getVapidKey, subscribe, unsubscribe } from "../controllers/pushController.js";

const router = express.Router();

router.get("/vapid-key", getVapidKey);
router.post("/subscribe", auth, subscribe);
router.post("/unsubscribe", auth, unsubscribe);

export default router;
