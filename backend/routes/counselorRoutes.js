const express = require("express");
const rateLimit = require("express-rate-limit");
const controller = require("../controller/counselorController");
const { authenticateCounselor } = require("../middleware/mobileAuthMiddleware");

const router = express.Router();

const counselorLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

// Counselor authentication and workspace endpoints are web-only.
router.post("/auth/login", counselorLoginLimiter, controller.counselorLogin);

router.get("/dashboard", authenticateCounselor, controller.getDashboard);
router.get("/students/:studentId", authenticateCounselor, controller.getStudentReport);
router.post("/students/:studentId/notes", authenticateCounselor, controller.addNote);
router.post("/students/:studentId/recommendations", authenticateCounselor, controller.addRecommendation);
router.put("/recommendations/:recommendationId", authenticateCounselor, controller.updateRecommendation);
router.get("/appointments", authenticateCounselor, controller.getCounselorAppointments);
router.put("/appointments/:appointmentId", authenticateCounselor, controller.updateAppointment);

module.exports = router;