import express from "express";

import {
  createSponsorship,
  getSponsorships
}
from "../controllers/sponsorshipController.js";

const router =
express.Router();

router.post(
  "/",
  createSponsorship
);

router.get(
  "/",
  getSponsorships
);

export default router;
