import express from "express";

import {
  createCampaign,
  getCampaigns
}
from "../controllers/campaignController.js";

const router =
express.Router();

router.post(
  "/",
  createCampaign
);

router.get(
  "/",
  getCampaigns
);

export default router;
