const { express } = require("../../backend/thirduserDependencies");
const controller = require("./controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateCounselor,
} = require("../../backend/middleware/mobileAuthMiddleware");

const router = express.Router();

router.post("/auth/login", controller.adminLogin);

router.get("/admin/users", authenticateAdmin, controller.listAdminUsers);
router.post("/admin/counselors", authenticateAdmin, controller.createCounselor);
router.put("/admin/counselors/:counselorId/assignments", authenticateAdmin, controller.assignStudents);

router.get("/counselor/dashboard", authenticateCounselor, controller.getDashboard);
router.get("/counselor/students/:studentId", authenticateCounselor, controller.getStudentReport);
router.post("/counselor/students/:studentId/notes", authenticateCounselor, controller.addNote);
router.post("/counselor/students/:studentId/recommendations", authenticateCounselor, controller.addRecommendation);
router.put("/counselor/recommendations/:recommendationId", authenticateCounselor, controller.updateRecommendation);
router.get("/counselor/appointments", authenticateCounselor, controller.getCounselorAppointments);
router.put("/counselor/appointments/:appointmentId", authenticateCounselor, controller.updateAppointment);

router.get("/student/counseling", authenticateUser, controller.getStudentCounseling);
router.post("/student/appointments", authenticateUser, controller.requestAppointment);
router.put("/student/recommendations/:recommendationId", authenticateUser, controller.updateStudentRecommendation);

module.exports = router;