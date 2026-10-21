const mongoose = require("mongoose");

// One row per thing a user (or admin) did.
// The name and email are copied onto each row on purpose, so the history
// stays readable even after an account is deleted.
const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    userName: { type: String, trim: true },

    userEmail: { type: String, trim: true, lowercase: true },

    actorRole: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // e.g. "auth.login", "resume.completed", "admin.user_disabled"
    action: { type: String, required: true, index: true },

    // The part of the action before the dot: auth, resume, interview, admin
    category: { type: String, required: true, index: true },

    description: { type: String },

    status: {
      type: String,
      enum: ["success", "failure"],
      default: "success",
    },

    ip: { type: String },

    userAgent: { type: String },

    // Small extra details (never passwords or tokens)
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
