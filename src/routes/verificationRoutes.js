import express from "express";

import auth from "../middleware/auth.js";

import {
  submitVerification,
  getVerificationRequests,
  approveVerification
}
from "../controllers/verificationController.js";

const router =
express.Router();

router.post(
  "/",
  auth,
  submitVerification
);

router.get(
  "/",
  auth,
  getVerificationRequests
);

router.put(
  "/:id/approve",
  auth,
  approveVerification
);

export default router;
