const express = require("express");

const {
  createMockInterview,
  getMockInterview,
  saveInterviewAnswer,
  analyzeAnswer,
  analyzeSession,
  completeMockInterview,
  getCompletedMockInterviews,
} = require("../controller/mockInterviewController");

const { authenticateUser } = require("../middleware/mobileAuthMiddleware");

const router = express.Router();

router.post("/", authenticateUser, createMockInterview);
router.get("/completed", authenticateUser, getCompletedMockInterviews);
router.get("/:id", authenticateUser, getMockInterview);
router.patch("/:id/answer", authenticateUser, saveInterviewAnswer);
router.post("/:id/analyze-answer", authenticateUser, analyzeAnswer);
router.post("/:id/analyze-session", authenticateUser, analyzeSession);
router.patch("/:id/complete", authenticateUser, completeMockInterview);

module.exports = router;
