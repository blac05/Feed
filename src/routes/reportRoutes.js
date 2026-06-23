import express from "express";
import auth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
import {
  createReport,
  getReports,
  reviewReport,
} from "../controllers/reportController.js";

const router = express.Router();

/**
 * @route   POST /api/reports
 * @desc    File a new platform compliance report
 * @access  Private (Any authenticated user)
 */
router.post("/", auth, createReport);

/**
 * @route   GET /api/reports
 * @desc    Fetch a paginated list of reports filtered by status (pending, reviewed, etc.)
 * @access  Private/Admin (Only platform administrators)
 */
router.get("/", auth, adminAuth, getReports);

/**
 * @route   PUT /api/reports/:id/review
 * @desc    Process, resolve, or execute administrative moderation notes/actions on a report
 * @access  Private/Admin (Only platform administrators)
 */
router.put("/:id/review", auth, adminAuth, reviewReport);

export default router;
