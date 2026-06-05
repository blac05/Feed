import express from "express";
import auth from "../middleware/auth.js";

import {
  createStore,
  getStore,
} from "../controllers/storeController.js";

const router =
  express.Router();

router.post(
  "/",
  auth,
  createStore
);

router.get(
  "/:id",
  getStore
);

export default router;
