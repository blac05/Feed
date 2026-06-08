import express from "express";

import {
  createAdvertisement,
  getAdvertisements
}
from "../controllers/advertisementController.js";

const router =
express.Router();

router.post(
  "/",
  createAdvertisement
);

router.get(
  "/",
  getAdvertisements
);

export default router;
