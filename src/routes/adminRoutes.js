import express from "express";

import auth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

import {
  getUsers
}
from "../controllers/adminController.js";

const router =
express.Router();

router.get(
  "/users",
  auth,
  adminAuth,
  getUsers
);

export default router;
