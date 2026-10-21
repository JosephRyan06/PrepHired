const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  adminLogin,
  getMe,
  getDashboard,
  getUsers,
  getUserDetail,
  updateUserStatus,
  getResumes,
  getInterviews,
  getAuditLogs,
  exportAuditLogs,
} = require("../controller/adminController");

const { authenticateAdmin } = require("../middleware/mobileAuthMiddleware");

const router = express.Router();

// 10 login attempts per 15 minutes
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  handler: (req, res) =>
    res.status(429).json({
      success: false,
      message: "Too many login attempts. Please try again after 15 minutes.",
    }),
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth
router.post("/auth/login", adminLoginLimiter, adminLogin);
router.get("/auth/me", authenticateAdmin, getMe);

// Everything below needs an admin token
router.get("/dashboard", authenticateAdmin, getDashboard);

router.get("/users", authenticateAdmin, getUsers);
router.get("/users/:id", authenticateAdmin, getUserDetail);
router.patch("/users/:id/status", authenticateAdmin, updateUserStatus);

router.get("/resumes", authenticateAdmin, getResumes);
router.get("/interviews", authenticateAdmin, getInterviews);

router.get("/audit-logs", authenticateAdmin, getAuditLogs);
router.get("/audit-logs/export", authenticateAdmin, exportAuditLogs);

module.exports = router;
