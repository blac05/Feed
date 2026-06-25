import express from "express";
import auth from "../middleware/auth.js";
import {
  getCreatorTiers, setupTiers, subscribe, cancelSubscription,
  getMySubscriptions, getMySubscribers, checkSubscription,
} from "../controllers/subscriptionController.js";

const router = express.Router();

router.get("/my", auth, getMySubscriptions);
router.get("/subscribers", auth, getMySubscribers);
router.get("/check/:creatorId", auth, checkSubscription);
router.get("/tiers/:creatorId", getCreatorTiers);
router.post("/tiers", auth, setupTiers);
router.post("/subscribe", auth, subscribe);
router.delete("/cancel/:creatorId", auth, cancelSubscription);

export default router;
