import express from "express";

import {
  createBrand,
  getBrands
}
from "../controllers/brandController.js";

const router =
express.Router();

router.post(
  "/",
  createBrand
);

router.get(
  "/",
  getBrands
);

export default router;
