const express = require("express");
const controller = require("../controller/counselorController");
const { authenticateUser } = require("../middleware/mobileAuthMiddleware");

const router = express.Router();

// Student counseling stays in the mobile API; counselor tools are web-only.
router.get("/", authenticateUser, controller.getStudentCounseling);
router.post("/appointments", authenticateUser, controller.requestAppointment);
router.put(
  "/recommendations/:recommendationId",
  authenticateUser,
  controller.updateStudentRecommendation,
);

module.exports = router;