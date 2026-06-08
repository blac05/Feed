import express from "express";
import auth from "../middleware/auth.js";

import {
  createBusiness,
  getBusinesses
}
from "../controllers/businessController.js";

const router =
express.Router();

router.post(
  "/",
  auth,
  createBusiness
);

router.get(
  "/",
  getBusinesses
);

export default router;
