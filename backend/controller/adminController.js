const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Resume = require("../models/resume");
const MockInterview = require("../models/mockInterview");
const AuditLog = require("../models/auditLog");

const {
  logActivity,
  buildAuditFilter,
  auditLogsToCsv,
} = require("../services/auditService");

// Day grouping for the charts uses this timezone (change it in .env if needed)
const TIMEZONE = process.env.ADMIN_TIMEZONE || "Asia/Manila";
const CHART_DAYS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;

/* ------------------------------ helpers ------------------------------ */

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getPaging = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 50);

  return { page, limit, skip: (page - 1) * limit };
};

const buildPagination = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.max(Math.ceil(total / limit), 1),
});

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const dayKey = (date) => dayFormatter.format(date);

// The last CHART_DAYS day keys, oldest first (e.g. "2026-10-14")
const getChartDays = () => {
  const days = [];

  for (let i = CHART_DAYS - 1; i >= 0; i -= 1) {
    days.push(dayKey(new Date(Date.now() - i * DAY_MS)));
  }

  return days;
};

// Count documents per day for the last CHART_DAYS days
const countPerDay = async (Model, extraMatch, days) => {
  const since = new Date(Date.now() - (CHART_DAYS + 1) * DAY_MS);

  const rows = await Model.aggregate([
    { $match: { ...extraMatch, createdAt: { $gte: since } } },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
            timezone: TIMEZONE,
          },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const counts = new Map(rows.map((row) => [row._id, row.count]));

  return days.map((day) => counts.get(day) || 0);
};

const round1 = (value) => Math.round((value || 0) * 10) / 10;

const SAFE_USER_FIELDS =
  "-password -resetOtpHash -resetOtpExpires -resetOtpAttempts -resetTokenHash -resetTokenExpires";

/* ------------------------------- auth -------------------------------- */

const adminLogin = async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    console.log("Login debug:", {
      email,
      userFound: Boolean(user),
      role: user?.role,
      isEnabled: user?.isEnabled,
    });

    // Same message for "no account", "not an admin" and "wrong password"
    const invalid = () => {
      logActivity(req, {
        action: "admin.login_failed",
        email,
        status: "failure",
        description: "Failed administrator login",
      });

      return res.status(401).json({
        success: false,
        message: "Invalid administrator credentials",
      });
    };

    if (!user || user.role !== "admin") {
      return invalid();
    }

    if (!user.isEnabled) {
      logActivity(req, {
        action: "admin.login_failed",
        user,
        status: "failure",
        description: "Login blocked: administrator account is disabled",
      });

      return res.status(403).json({
        success: false,
        message: "This administrator account is disabled",
      });
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return invalid();
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "12h" },
    );

    logActivity(req, {
      action: "admin.login",
      user,
      description: "Logged in to the admin console",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Used by the web app to check that a stored token is still valid
const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    admin: {
      _id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

/* ----------------------------- dashboard ----------------------------- */

const getDashboard = async (req, res) => {
  try {
    const days = getChartDays();
    const weekAgo = new Date(Date.now() - 7 * DAY_MS);
    const userFilter = { role: "user" };

    const [
      totalUsers,
      disabledUsers,
      newUsersThisWeek,
      totalResumes,
      completedResumes,
      totalInterviews,
      completedInterviews,
      interviewScores,
      atsScores,
      resumesByTemplate,
      interviewsByCategory,
      topJobs,
      recentUsers,
      newUsersPerDay,
      resumesPerDay,
      interviewsPerDay,
    ] = await Promise.all([
      User.countDocuments(userFilter),
      User.countDocuments({ ...userFilter, isEnabled: false }),
      User.countDocuments({ ...userFilter, createdAt: { $gte: weekAgo } }),

      Resume.countDocuments(),
      Resume.countDocuments({ status: "completed" }),

      MockInterview.countDocuments(),
      MockInterview.countDocuments({ status: "completed" }),

      MockInterview.aggregate([
        { $match: { status: "completed", overallScore: { $gt: 0 } } },
        {
          $group: {
            _id: null,
            overall: { $avg: "$overallScore" },
            communication: { $avg: "$skillBreakdown.communication" },
            technicalKnowledge: { $avg: "$skillBreakdown.technicalKnowledge" },
            problemSolving: { $avg: "$skillBreakdown.problemSolving" },
            confidence: { $avg: "$skillBreakdown.confidence" },
            relevance: { $avg: "$skillBreakdown.relevance" },
          },
        },
      ]),

      Resume.aggregate([
        { $match: { "aiAnalysis.atsScore": { $gt: 0 } } },
        { $group: { _id: null, avg: { $avg: "$aiAnalysis.atsScore" } } },
      ]),

      Resume.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: { $ifNull: ["$template", "classic"] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      MockInterview.aggregate([
        { $group: { _id: "$interviewCategory", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      MockInterview.aggregate([
        {
          $group: {
            _id: { $toLower: { $trim: { input: "$targetJob" } } },
            label: { $first: "$targetJob" },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),

      User.find(userFilter)
        .sort({ createdAt: -1 })
        .limit(5)
        .select("fullName email isEnabled createdAt")
        .lean(),

      countPerDay(User, userFilter, days),
      countPerDay(Resume, {}, days),
      countPerDay(MockInterview, {}, days),
    ]);

    const scores = interviewScores[0] || {};

    return res.status(200).json({
      success: true,
      timezone: TIMEZONE,
      totals: {
        users: totalUsers,
        activeUsers: totalUsers - disabledUsers,
        disabledUsers,
        newUsersThisWeek,
        resumes: totalResumes,
        completedResumes,
        draftResumes: totalResumes - completedResumes,
        interviews: totalInterviews,
        completedInterviews,
        averageInterviewScore: round1(scores.overall),
        averageAtsScore: round1(atsScores[0]?.avg),
      },
      activity: {
        days,
        newUsers: newUsersPerDay,
        resumes: resumesPerDay,
        interviews: interviewsPerDay,
      },
      resumesByTemplate: resumesByTemplate.map((row) => ({
        label: row._id,
        value: row.count,
      })),
      interviewsByCategory: interviewsByCategory.map((row) => ({
        label: row._id,
        value: row.count,
      })),
      skillAverages: [
        { label: "Communication", value: round1(scores.communication) },
        { label: "Technical knowledge", value: round1(scores.technicalKnowledge) },
        { label: "Problem solving", value: round1(scores.problemSolving) },
        { label: "Confidence", value: round1(scores.confidence) },
        { label: "Relevance", value: round1(scores.relevance) },
      ],
      topJobs: topJobs.map((row) => ({
        label: row.label,
        value: row.count,
      })),
      recentUsers,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};

/* ------------------------------- users ------------------------------- */

const getUsers = async (req, res) => {
  try {
    const { page, limit, skip } = getPaging(req.query);
    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "all");

    const filter = { role: "user" };

    if (status === "active") filter.isEnabled = true;
    if (status === "disabled") filter.isEnabled = false;

    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      filter.$or = [{ fullName: regex }, { email: regex }];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("fullName email isEnabled createdAt")
        .lean(),
      User.countDocuments(filter),
    ]);

    const ids = users.map((user) => user._id);

    const [resumeCounts, interviewCounts] = await Promise.all([
      Resume.aggregate([
        { $match: { userId: { $in: ids } } },
        {
          $group: {
            _id: "$userId",
            total: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
          },
        },
      ]),
      MockInterview.aggregate([
        { $match: { userId: { $in: ids } } },
        {
          $group: {
            _id: "$userId",
            total: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
          },
        },
      ]),
    ]);

    const resumeMap = new Map(resumeCounts.map((row) => [String(row._id), row]));
    const interviewMap = new Map(
      interviewCounts.map((row) => [String(row._id), row]),
    );

    const rows = users.map((user) => {
      const resumes = resumeMap.get(String(user._id));
      const interviews = interviewMap.get(String(user._id));

      return {
        ...user,
        resumes: { total: resumes?.total || 0, completed: resumes?.completed || 0 },
        interviews: {
          total: interviews?.total || 0,
          completed: interviews?.completed || 0,
        },
      };
    });

    return res.status(200).json({
      success: true,
      users: rows,
      pagination: buildPagination(page, limit, total),
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load users",
    });
  }
};

const getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    const user = await User.findOne({ _id: id, role: "user" })
      .select(SAFE_USER_FIELDS)
      .lean();

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const [resumes, interviews, activity] = await Promise.all([
      Resume.find({ userId: id })
        .sort({ updatedAt: -1 })
        .select(
          "basicInfo.fullName targetJob.jobTitle template status currentStep aiAnalysis.atsScore createdAt updatedAt",
        )
        .lean(),
      MockInterview.find({ userId: id })
        .sort({ createdAt: -1 })
        .select(
          "targetJob interviewCategory responseMode status numberOfQuestions overallScore startedAt completedAt createdAt",
        )
        .lean(),
      AuditLog.find({ userId: id })
        .sort({ createdAt: -1 })
        .limit(15)
        .select("action description status ip createdAt")
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      user,
      resumes,
      interviews,
      activity,
    });
  } catch (error) {
    console.error("Get user detail error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load user",
    });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isEnabled } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    if (typeof isEnabled !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isEnabled must be true or false",
      });
    }

    // findOneAndUpdate skips full-document validation, so older accounts
    // with missing optional fields can still be enabled or disabled
    const user = await User.findOneAndUpdate(
      { _id: id, role: "user" },
      { isEnabled },
      { new: true },
    ).select("fullName email isEnabled");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    logActivity(req, {
      action: isEnabled ? "admin.user_enabled" : "admin.user_disabled",
      description: `${isEnabled ? "Enabled" : "Disabled"} the account of ${user.fullName} (${user.email})`,
      metadata: { targetUserId: String(user._id) },
    });

    return res.status(200).json({
      success: true,
      message: isEnabled ? "Account enabled" : "Account disabled",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        isEnabled: user.isEnabled,
      },
    });
  } catch (error) {
    console.error("Update user status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update account",
    });
  }
};

/* ------------------------------ resumes ------------------------------ */

// Ids of regular users whose name or email matches the search text
const findUserIds = (regex) =>
  User.distinct("_id", {
    role: "user",
    $or: [{ fullName: regex }, { email: regex }],
  });

const getResumes = async (req, res) => {
  try {
    const { page, limit, skip } = getPaging(req.query);
    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "all");
    const template = String(req.query.template || "all");

    const filter = {};

    if (["draft", "completed"].includes(status)) filter.status = status;

    if (["classic", "modern", "professional", "minimal"].includes(template)) {
      filter.template = template;
    }

    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      const userIds = await findUserIds(regex);

      filter.$or = [
        { "basicInfo.fullName": regex },
        { "targetJob.jobTitle": regex },
        { userId: { $in: userIds } },
      ];
    }

    const [resumes, total] = await Promise.all([
      Resume.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          "userId basicInfo.fullName targetJob.jobTitle template status currentStep aiAnalysis.atsScore createdAt updatedAt",
        )
        .populate("userId", "fullName email")
        .lean(),
      Resume.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      resumes,
      pagination: buildPagination(page, limit, total),
    });
  } catch (error) {
    console.error("Get resumes error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load resumes",
    });
  }
};

/* ----------------------------- interviews ---------------------------- */

const getInterviews = async (req, res) => {
  try {
    const { page, limit, skip } = getPaging(req.query);
    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "all");
    const category = String(req.query.category || "all");

    const filter = {};

    if (["in-progress", "completed"].includes(status)) filter.status = status;

    if (["Behavioral", "Technical", "HR Screening", "All"].includes(category)) {
      filter.interviewCategory = category;
    }

    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      const userIds = await findUserIds(regex);

      filter.$or = [{ targetJob: regex }, { userId: { $in: userIds } }];
    }

    const [interviews, total] = await Promise.all([
      MockInterview.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          "userId targetJob interviewCategory responseMode status numberOfQuestions overallScore startedAt completedAt createdAt",
        )
        .populate("userId", "fullName email")
        .lean(),
      MockInterview.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      interviews,
      pagination: buildPagination(page, limit, total),
    });
  } catch (error) {
    console.error("Get interviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load mock interviews",
    });
  }
};

/* ----------------------------- audit log ----------------------------- */

const getAuditLogs = async (req, res) => {
  try {
    const { page, limit, skip } = getPaging(req.query);
    const filter = buildAuditFilter(req.query);
    const since = new Date(Date.now() - DAY_MS);

    const [logs, total, eventsLast24h, failedLogins, activeUsers] =
      await Promise.all([
        AuditLog.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        AuditLog.countDocuments(filter),
        AuditLog.countDocuments({ createdAt: { $gte: since } }),
        AuditLog.countDocuments({
          createdAt: { $gte: since },
          action: { $in: ["auth.login_failed", "admin.login_failed", "counselor.login_failed"] },
        }),
        AuditLog.distinct("userId", {
          createdAt: { $gte: since },
          actorRole: "user",
          userId: { $ne: null },
        }),
      ]);

    return res.status(200).json({
      success: true,
      logs,
      pagination: buildPagination(page, limit, total),
      summary: {
        eventsLast24h,
        failedLogins,
        activeUsers: activeUsers.length,
      },
    });
  } catch (error) {
    console.error("Get audit logs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load the audit log",
    });
  }
};

// Downloads the filtered audit log as a CSV file (newest 5000 rows)
const exportAuditLogs = async (req, res) => {
  try {
    const filter = buildAuditFilter(req.query);

    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(5000)
      .lean();

    logActivity(req, {
      action: "admin.audit_exported",
      description: `Exported ${logs.length} audit log entries to CSV`,
    });

    res.set({
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="audit-log.csv"',
    });

    return res.send(auditLogsToCsv(logs));
  } catch (error) {
    console.error("Export audit logs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to export the audit log",
    });
  }
};

module.exports = {
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
};
