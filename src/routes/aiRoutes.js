import express from "express";

import auth from "../middleware/auth.js";

import {
  createCaption
}
from "../controllers/aiController.js";

const router =
  express.Router();

router.post(
  "/caption",
  auth,
  createCaption
);

export default router;
