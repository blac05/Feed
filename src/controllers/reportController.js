import Report from "../models/Report.js";
import Post from "../models/Post.js"; // Used for handling post isolation workflows

/**
 * @route   POST /api/reports
 * @desc    File a content/user compliance report with automated severity tracking
 */
export const createReport = async (req, res, next) => {
  try {
    const { targetId, targetType, category, type, reason, aiScore, aiSummary } = req.body;
    const currentUserId = req.user._id;

    if (!targetId || !targetType) {
      return res.status(400).json({ success: false, message: "Target item identifiers are required" });
    }

    // Guard: Prevent duplicate filing by the same user on the same asset
    const existingReport = await Report.findOne({
      reporter: currentUserId,
      targetId: targetId,
    });

    if (existingReport) {
      return res.status(400).json({ success: false, message: "You have already reported this item" });
    }

    // Normalize incoming payload variation ('category' matches our unified model architecture)
    const reportCategory = category || type || "other";

    const report = await Report.create({
      reporter: currentUserId,
      targetId,
      targetType,
      category: reportCategory,
      reason: reason || "",
      aiScore: aiScore || 0,
      aiSummary: aiSummary || "",
    });

    // Automation Workflow: If AI evaluation returns critical toxicity (>= 8), auto-hide immediately
    if (aiScore >= 8 && targetType === "post") {
      await Post.findByIdAndUpdate(targetId, { hidden: true });
    }

    res.status(201).json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/reports
 * @desc    Fetch paginated tracking lists filtered by processing operational status
 */
export const getReports = async (req, res, next) => {
  try {
    const { status = "pending", page = 1, limit = 20 } = req.query;
    
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 20;
    const skipIndex = (parsedPage - 1) * parsedLimit;

    // Fetch reports matching the query lifecycle criteria
    const reports = await Report.find({ status })
      .populate("reporter", "username name avatar")
      .populate("reviewedBy", "username name")
      // NOTE: For targetId dynamic population, ensure your schema sets 'refPath: "targetType"'
      .populate({ path: "targetId" }) 
      .sort({ createdAt: -1 })
      .skip(skipIndex)
      .limit(parsedLimit);

    const total = await Report.countDocuments({ status });

    res.json({
      success: true,
      reports,
      pagination: {
        total,
        page: parsedPage,
        pages: Math.ceil(total / parsedLimit),
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/reports/:id/review
 * @desc    Apply administrative choices, custom system logging notes, and visibility adjustments
 */
export const reviewReport = async (req, res, next) => {
  try {
    const { status, reviewNote, action } = req.body;
    
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: "Report instance not found" });
    }

    // Update operational workflows metadata
    report.status = status || "reviewed";
    report.reviewNote = reviewNote || "";
    report.reviewedBy = req.user._id;
    await report.save();

    // Contextual Action Execution
    if (report.targetType === "post") {
      if (action === "hide_post") {
        await Post.findByIdAndUpdate(report.targetId, { hidden: true });
      } else if (action === "unhide_post") {
        await Post.findByIdAndUpdate(report.targetId, { hidden: false });
      }
    }

    res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

// Map legacy reference point update handlers to our refined review pipeline
export { reviewReport as updateReport };

