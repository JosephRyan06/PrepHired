const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/user");
const Resume = require("../models/resume");
const MockInterview = require("../models/mockInterview");
const CounselorNote = require("../models/CounselorNote");
const ProgressRecommendation = require("../models/ProgressRecommendation");
const CounselingAppointment = require("../models/CounselingAppointment");
const progressService = require("../services/progressService");
const { logActivity } = require("../services/auditService");

const safeUser = (user) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  fullName: user.fullName,
  email: user.email,
});

const fail = (res, status, message) =>
  res.status(status).json({ success: false, message });

// Counselor authentication is separate from the upstream admin login/session.
const counselorLogin = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = req.body.password;
    const user = await User.findOne({ email });

    if (!user || user.role !== "counselor") {
      logActivity(req, {
        action: "counselor.login_failed",
        email,
        status: "failure",
        description: "Failed counselor login",
      });
      return fail(res, 401, "Invalid counselor credentials");
    }
    if (!user.isEnabled || !user.isEmailVerified) {
      logActivity(req, {
        action: "counselor.login_failed",
        user,
        status: "failure",
        description: "Counselor login blocked by account status",
      });
      return fail(res, 403, "Your counselor account is disabled or not verified");
    }
    if (!(await bcrypt.compare(String(password || ""), user.password))) {
      logActivity(req, {
        action: "counselor.login_failed",
        user,
        status: "failure",
        description: "Failed counselor login",
      });
      return fail(res, 401, "Invalid counselor credentials");
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "12h" },
    );
    logActivity(req, {
      action: "counselor.login",
      user,
      description: "Logged in to the counselor workspace",
    });
    return res.json({ success: true, token, counselor: { ...safeUser(user), role: user.role } });
  } catch (error) {
    console.error("Counselor login error:", error.message);
    return fail(res, 500, "Unable to sign in");
  }
};

// Admin-only account provisioning is mounted inside the upstream admin router.
const listCounselorsAndStudents = async (req, res) => {
  try {
    const [counselors, students] = await Promise.all([
      User.find({ role: "counselor" }).select("firstName lastName fullName email assignedStudentIds isEnabled"),
      User.find({ role: "user", isEnabled: true }).select("firstName lastName fullName email isEnabled createdAt"),
    ]);
    return res.json({
      success: true,
      counselors: counselors.map((counselor) => ({
        ...safeUser(counselor),
        assignedStudentIds: counselor.assignedStudentIds,
        isEnabled: counselor.isEnabled,
      })),
      students: students.map((student) => ({ ...safeUser(student), isEnabled: student.isEnabled })),
    });
  } catch (error) {
    console.error("Admin user list error:", error.message);
    return fail(res, 500, "Unable to load users");
  }
};

const createCounselor = async (req, res) => {
  try {
    const firstName = String(req.body.firstName || "").trim();
    const lastName = String(req.body.lastName || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!firstName || !lastName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return fail(res, 400, "Enter the counselor's name and a valid email");
    }
    if (password.length < 12 || password.length > 72) {
      return fail(res, 400, "Set a temporary password with 12 to 72 characters");
    }
    if (await User.exists({ email })) return fail(res, 409, "That email is already registered");

    const counselor = await User.create({
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email,
      password: await bcrypt.hash(password, 10),
      role: "counselor",
      assignedStudentIds: [],
      isEnabled: true,
      isEmailVerified: true,
      termsAccepted: true,
    });
    return res.status(201).json({ success: true, counselor: safeUser(counselor) });
  } catch (error) {
    if (error.code === 11000) return fail(res, 409, "That email is already registered");
    console.error("Create counselor error:", error.message);
    return fail(res, 500, "Unable to create counselor");
  }
};

const assignStudents = async (req, res) => {
  try {
    const studentIds = req.body.studentIds;
    if (!Array.isArray(studentIds) || studentIds.some((id) => !mongoose.isValidObjectId(id))) {
      return fail(res, 400, "Provide a valid list of student IDs");
    }

    const [counselor, students] = await Promise.all([
      User.findOne({ _id: req.params.counselorId, role: "counselor" }),
      User.find({ _id: { $in: [...new Set(studentIds)] }, role: "user", isEnabled: true }).select("_id"),
    ]);
    if (!counselor) return fail(res, 404, "Counselor not found");
    if (students.length !== new Set(studentIds).size) {
      return fail(res, 400, "One or more selected students were not found");
    }

    counselor.assignedStudentIds = students.map((student) => student._id);
    await counselor.save();
    return res.json({ success: true, assignedStudentIds: counselor.assignedStudentIds });
  } catch (error) {
    console.error("Assign students error:", error.message);
    return fail(res, 500, "Unable to update student assignments");
  }
};

const assertAssignedStudent = async (counselorId, studentId) => {
  if (!mongoose.isValidObjectId(studentId)) return null;
  const counselor = await User.findById(counselorId).select("assignedStudentIds");
  const isAssigned = counselor?.assignedStudentIds.some((assignedId) =>
    assignedId.equals(studentId),
  );
  if (!isAssigned) return null;
  return User.findOne({ _id: studentId, role: "user", isEnabled: true }).select(
    "firstName lastName fullName email",
  );
};

const getReadiness = async (studentId) => progressService.getProgress(studentId);

const getDashboard = async (req, res) => {
  try {
    const students = await User.find({
      _id: { $in: req.user.assignedStudentIds },
      role: "user",
      isEnabled: true,
    }).select("firstName lastName fullName email createdAt");
    const appointments = await CounselingAppointment.find({
      counselorId: req.user._id,
      studentId: { $in: req.user.assignedStudentIds },
      startsAt: { $gte: new Date() },
      status: { $in: ["requested", "confirmed"] },
    }).sort({ startsAt: 1 }).limit(12).populate("studentId", "firstName lastName fullName");
    const studentRows = await Promise.all(students.map(async (student) => ({
      ...safeUser(student),
      progress: await getReadiness(student._id),
    })));

    return res.json({
      success: true,
      students: studentRows,
      appointments,
      needsAttention: studentRows.filter(({ progress }) => progress.employmentReadiness < 50).length,
      averageReadiness: studentRows.length
        ? Math.round(studentRows.reduce((sum, student) => sum + student.progress.employmentReadiness, 0) / studentRows.length)
        : 0,
    });
  } catch (error) {
    console.error("Counselor dashboard error:", error.message);
    return fail(res, 500, "Unable to load the counselor dashboard");
  }
};

const getStudentReport = async (req, res) => {
  try {
    const student = await assertAssignedStudent(req.user._id, req.params.studentId);
    if (!student) return fail(res, 404, "Assigned student not found");

    const [profileResume, resumes, interviews, notes, recommendations] = await Promise.all([
      Resume.findOne({ userId: student._id }).sort({ createdAt: -1 }),
      Resume.find({ userId: student._id, status: "completed" }).sort({ createdAt: -1 }).limit(10),
      MockInterview.find({ userId: student._id, status: "completed" }).sort({ completedAt: -1 }).limit(10),
      CounselorNote.find({ counselorId: req.user._id, studentId: student._id }).sort({ createdAt: -1 }),
      ProgressRecommendation.find({ counselorId: req.user._id, studentId: student._id }).sort({ createdAt: -1 }),
    ]);
    const latestResume = resumes[0] || null;
    const progress = await getReadiness(student._id);

    return res.json({
      success: true,
      student: safeUser(student),
      progress,
      careerProfile: profileResume ? {
        targetJob: profileResume.targetJob,
        skills: profileResume.skills,
        resumeStrength: profileResume.aiAnalysis,
        skillGaps: profileResume.status === "completed"
          ? profileResume.aiAnalysis?.missingKeywords || []
          : [],
      } : null,
      resumes: resumes.map((resume) => ({
        _id: resume._id,
        targetJob: resume.targetJob,
        atsScore: resume.aiAnalysis?.atsScore || 0,
        status: resume.status,
        createdAt: resume.createdAt,
        missingKeywords: resume.aiAnalysis?.missingKeywords || [],
        matchingKeywords: resume.aiAnalysis?.matchingKeywords || [],
      })),
      interviews: interviews.map((interview) => ({
        _id: interview._id,
        targetJob: interview.targetJob,
        overallScore: interview.overallScore,
        skillBreakdown: interview.skillBreakdown,
        completedAt: interview.completedAt,
      })),
      notes,
      recommendations,
    });
  } catch (error) {
    console.error("Student report error:", error.message);
    return fail(res, 500, "Unable to load the student report");
  }
};

const addNote = async (req, res) => {
  const content = String(req.body.content || "").trim();
  if (!content) return fail(res, 400, "Note content is required");
  const student = await assertAssignedStudent(req.user._id, req.params.studentId);
  if (!student) return fail(res, 404, "Assigned student not found");
  const note = await CounselorNote.create({ counselorId: req.user._id, studentId: student._id, content });
  return res.status(201).json({ success: true, note });
};

const addRecommendation = async (req, res) => {
  const title = String(req.body.title || "").trim();
  if (!title) return fail(res, 400, "Task title is required");
  const student = await assertAssignedStudent(req.user._id, req.params.studentId);
  if (!student) return fail(res, 404, "Assigned student not found");
  const allowedCategories = ["resume", "skill", "interview", "career", "other"];
  const recommendation = await ProgressRecommendation.create({
    counselorId: req.user._id,
    studentId: student._id,
    title,
    details: String(req.body.details || "").trim(),
    category: allowedCategories.includes(req.body.category) ? req.body.category : "other",
    dueAt: req.body.dueAt ? new Date(req.body.dueAt) : null,
  });
  return res.status(201).json({ success: true, recommendation });
};

const updateRecommendation = async (req, res) => {
  const recommendation = await ProgressRecommendation.findOne({
    _id: req.params.recommendationId,
    counselorId: req.user._id,
    status: { $in: ["open", "completed"] },
  });
  if (!recommendation) return fail(res, 404, "Recommendation not found");
  if (!(await assertAssignedStudent(req.user._id, recommendation.studentId))) {
    return fail(res, 404, "Assigned student not found");
  }
  if (!["open", "completed"].includes(req.body.status)) return fail(res, 400, "Invalid task status");
  recommendation.status = req.body.status;
  await recommendation.save();
  return res.json({ success: true, recommendation });
};

const getCounselorAppointments = async (req, res) => {
  const appointments = await CounselingAppointment.find({ counselorId: req.user._id })
    .where("studentId").in(req.user.assignedStudentIds)
    .sort({ startsAt: 1 }).populate("studentId", "firstName lastName fullName email");
  return res.json({ success: true, appointments });
};

const updateAppointment = async (req, res) => {
  const allowedStatuses = ["confirmed", "completed", "cancelled"];
  if (!allowedStatuses.includes(req.body.status)) return fail(res, 400, "Invalid appointment status");
  const appointment = await CounselingAppointment.findOneAndUpdate(
    {
      _id: req.params.appointmentId,
      counselorId: req.user._id,
      studentId: { $in: req.user.assignedStudentIds },
      status: { $ne: "cancelled" },
    },
    { status: req.body.status },
    { new: true },
  );
  if (!appointment) return fail(res, 404, "Appointment not found");
  return res.json({ success: true, appointment });
};

const getStudentCounseling = async (req, res) => {
  const counselors = await User.find({
    role: "counselor",
    isEnabled: true,
    assignedStudentIds: req.user._id,
  }).select("firstName lastName fullName email");
  const [recommendations, appointments] = await Promise.all([
    ProgressRecommendation.find({
      studentId: req.user._id,
      counselorId: { $in: counselors.map((counselor) => counselor._id) },
    }).sort({ createdAt: -1 }).populate("counselorId", "fullName"),
    CounselingAppointment.find({
      studentId: req.user._id,
      counselorId: { $in: counselors.map((counselor) => counselor._id) },
    }).sort({ startsAt: 1 }).populate("counselorId", "fullName"),
  ]);
  return res.json({ success: true, counselors, recommendations, appointments });
};

const requestAppointment = async (req, res) => {
  const counselorId = req.body.counselorId;
  const startsAt = new Date(req.body.startsAt);
  if (!mongoose.isValidObjectId(counselorId) || Number.isNaN(startsAt.getTime()) || startsAt <= new Date()) {
    return fail(res, 400, "Choose an assigned counselor and a future appointment time");
  }
  const counselor = await User.findOne({
    _id: counselorId,
    role: "counselor",
    isEnabled: true,
    assignedStudentIds: req.user._id,
  }).select("_id");
  if (!counselor) return fail(res, 404, "Counselor not found for this student");

  const appointment = await CounselingAppointment.create({
    counselorId,
    studentId: req.user._id,
    requestedBy: "student",
    startsAt,
    purpose: String(req.body.purpose || "").trim(),
  });
  return res.status(201).json({ success: true, appointment });
};

const updateStudentRecommendation = async (req, res) => {
  if (req.body.status !== "completed") return fail(res, 400, "Invalid task status");
  const assignedCounselors = await User.find({
    role: "counselor",
    isEnabled: true,
    assignedStudentIds: req.user._id,
  }).select("_id");
  const recommendation = await ProgressRecommendation.findOneAndUpdate(
    {
      _id: req.params.recommendationId,
      studentId: req.user._id,
      counselorId: { $in: assignedCounselors.map((counselor) => counselor._id) },
    },
    { status: "completed" },
    { new: true },
  );
  if (!recommendation) return fail(res, 404, "Progress task not found");
  return res.json({ success: true, recommendation });
};

module.exports = {
  counselorLogin,
  listCounselorsAndStudents,
  createCounselor,
  assignStudents,
  getDashboard,
  getStudentReport,
  addNote,
  addRecommendation,
  updateRecommendation,
  getCounselorAppointments,
  updateAppointment,
  getStudentCounseling,
  requestAppointment,
  updateStudentRecommendation,
};