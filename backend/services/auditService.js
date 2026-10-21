const mongoose = require("mongoose");

const AuditLog = require("../models/auditLog");

// Dates in the audit log filters and the CSV export use this timezone
const TIMEZONE = process.env.ADMIN_TIMEZONE || "Asia/Manila";

const CATEGORIES = ["auth", "resume", "interview", "admin", "counselor"];

/* ------------------------------ logging ------------------------------ */

const getIp = (req) => {
  const forwarded = req?.headers?.["x-forwarded-for"];

  const raw = forwarded
    ? String(forwarded).split(",")[0]
    : req?.ip || req?.socket?.remoteAddress || "";

  return raw.trim().replace(/^::ffff:/, "").slice(0, 64);
};

/**
 * Records one audit event. It never throws and never makes the request wait,
 * so a logging problem can never break login, resumes or interviews.
 *
 *   logActivity(req, {
 *     action: "resume.completed",        // required: "<category>.<what happened>"
 *     description: "Completed a resume", // short sentence shown in the admin
 *     user,                              // optional, defaults to req.user
 *     email,                             // optional, for events with no user (failed login)
 *     status: "failure",                 // optional, defaults to "success"
 *     metadata: { ... },                 // optional small details, never secrets
 *   });
 */
const logActivity = (req, options = {}) => {
  try {
    const { action, user, email, description, status, metadata } = options;

    if (!action) return;

    const actor = user || req?.user || null;
    const userEmail = String(actor?.email || email || "")
      .toLowerCase()
      .trim()
      .slice(0, 200);

    AuditLog.create({
      userId: actor?._id || undefined,
      userName: actor?.fullName || undefined,
      userEmail: userEmail || undefined,
      actorRole: action.startsWith("admin.") || actor?.role === "admin"
        ? "admin"
        : action.startsWith("counselor.") || actor?.role === "counselor"
          ? "counselor"
          : "user",
      action,
      category: action.split(".")[0],
      description: description ? String(description).slice(0, 300) : undefined,
      status: status === "failure" ? "failure" : "success",
      ip: getIp(req),
      userAgent: String(req?.headers?.["user-agent"] || "").slice(0, 300),
      metadata,
    }).catch((error) => {
      console.error("Audit log error:", error.message);
    });
  } catch (error) {
    console.error("Audit log error:", error.message);
  }
};

/* ------------------------------ filtering ---------------------------- */

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isDay = (value) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(Date.parse(`${value}T00:00:00Z`));

// The moment a calendar day ("2026-10-14") starts in TIMEZONE
const startOfDay = (day) => {
  const guess = new Date(`${day}T00:00:00Z`);

  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: TIMEZONE,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .formatToParts(guess)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );

  return new Date(guess.getTime() - (asUtc - guess.getTime()));
};

// Turns the query string of the admin page into a MongoDB filter
const buildAuditFilter = (query = {}) => {
  const filter = {};

  const category = String(query.category || "all");
  if (CATEGORIES.includes(category)) filter.category = category;

  const status = String(query.status || "all");
  if (["success", "failure"].includes(status)) filter.status = status;

  const userId = String(query.userId || "");
  if (mongoose.isValidObjectId(userId)) filter.userId = userId;

  const from = String(query.from || "");
  const to = String(query.to || "");

  if (isDay(from) || isDay(to)) {
    filter.createdAt = {};

    if (isDay(from)) filter.createdAt.$gte = startOfDay(from);

    if (isDay(to)) {
      filter.createdAt.$lt = new Date(
        startOfDay(to).getTime() + 24 * 60 * 60 * 1000,
      );
    }
  }

  const search = String(query.search || "").trim();

  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");

    filter.$or = [
      { userName: regex },
      { userEmail: regex },
      { description: regex },
      { action: regex },
      { ip: regex },
    ];
  }

  return filter;
};

/* ------------------------------ CSV export --------------------------- */

const timeFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIMEZONE,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const formatTime = (date) => {
  const parts = Object.fromEntries(
    timeFormatter
      .formatToParts(new Date(date))
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
};

// Quotes a value for CSV. A leading = + - @ is neutralized so a job title
// like "=HYPERLINK(...)" cannot run as a formula when opened in Excel.
const csvCell = (value) => {
  let text = String(value ?? "");

  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;

  return `"${text.replace(/"/g, '""')}"`;
};

const auditLogsToCsv = (logs) => {
  const header = [
    "Time",
    "User",
    "Email",
    "Role",
    "Action",
    "Details",
    "Status",
    "IP address",
  ];

  const rows = logs.map((log) => [
    formatTime(log.createdAt),
    log.userName || "",
    log.userEmail || "",
    log.actorRole,
    log.action,
    log.description || "",
    log.status,
    log.ip || "",
  ]);

  // The BOM at the start makes Excel read the file as UTF-8
  return (
    "\uFEFF" +
    [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n")
  );
};

module.exports = {
  logActivity,
  buildAuditFilter,
  auditLogsToCsv,
};
