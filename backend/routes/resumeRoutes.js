const express = require("express");
const router = express.Router();

const {
  importResume,
  createResume,
  getDraftResume,
  getResume,
  saveBasicInfo,
  saveTargetJob,
  saveWorkExperience,
  saveEducation,
  saveSummaryExtras,
  saveTemplate,
  generateSummary,
  completeResume,
  analyzeResume,
  optimizeResume,
  getCompletedResumes,
  exportResumePDF,
} = require("../controller/resumeController");

const { authenticateUser } = require("../middleware/mobileAuthMiddleware");
const uploadResume  = require("../middleware/uploadResume");

router.post(
  "/upload",
  authenticateUser,
  uploadResume.single("resume"),
  importResume
);
          
router.post("/", authenticateUser, createResume);
router.get("/draft", authenticateUser, getDraftResume);
router.get("/:id/export-pdf", authenticateUser, exportResumePDF);
router.get("/completed", authenticateUser, getCompletedResumes);

//CREATING RESUME
router.get("/:id", authenticateUser, getResume);
router.put("/:id/basic-info", authenticateUser, saveBasicInfo);
router.put("/:id/target-job", authenticateUser, saveTargetJob);
router.put("/:id/work-experience", authenticateUser, saveWorkExperience);
router.put("/:id/education", authenticateUser, saveEducation);
router.put("/:id/summary-extras", authenticateUser, saveSummaryExtras);
router.put("/:id/template", authenticateUser, saveTemplate);
router.put("/:id/complete", authenticateUser, completeResume);

//AI
router.post("/:id/generate-summary", authenticateUser, generateSummary);
router.post("/:id/analyze", authenticateUser, analyzeResume);
router.post("/:id/optimize", authenticateUser, optimizeResume);

module.exports = router;
