const express = require("express");
const router = express.Router();

const {
  createApplicantProfile,
  getApplicantProfiles,
  getApplicantProfileById,
  updateEmploymentReadiness,
  deleteApplicantProfile,
} = require("../controller/applicantProfileController");

const { authenticateUser } = require("../middleware/mobileAuthMiddleware");


router.post("/", authenticateUser, createApplicantProfile);
router.get("/", authenticateUser, getApplicantProfiles);
router.get("/:profileId", authenticateUser, getApplicantProfileById);


router.put(
  "/:profileId/employment-readiness",
  authenticateUser,
  updateEmploymentReadiness,
);


router.delete("/:profileId", authenticateUser, deleteApplicantProfile);

module.exports = router;
