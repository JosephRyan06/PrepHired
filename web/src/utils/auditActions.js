// How each action is shown in the admin: a readable name and a badge color.
// Unknown actions still show up, using the raw action text.
const ACTIONS = {
  "auth.register": { label: "Signed up", tone: "info" },
  "auth.login": { label: "Logged in", tone: "good" },
  "auth.login_failed": { label: "Failed login", tone: "bad" },
  "auth.password_changed": { label: "Password changed", tone: "warn" },
  "auth.password_reset": { label: "Password reset", tone: "warn" },
  "auth.account_deleted": { label: "Account deleted", tone: "bad" },

  "resume.created": { label: "Resume started", tone: "info" },
  "resume.imported": { label: "Resume imported", tone: "info" },
  "resume.completed": { label: "Resume completed", tone: "good" },
  "resume.analyzed": { label: "Resume analyzed", tone: "info" },
  "resume.exported": { label: "Resume exported", tone: "info" },

  "interview.started": { label: "Interview started", tone: "info" },
  "interview.completed": { label: "Interview completed", tone: "good" },

  "admin.login": { label: "Admin login", tone: "muted" },
  "admin.login_failed": { label: "Admin failed login", tone: "bad" },
  "admin.user_disabled": { label: "Account disabled", tone: "warn" },
  "admin.user_enabled": { label: "Account enabled", tone: "good" },
  "admin.audit_exported": { label: "Audit log exported", tone: "muted" },
};

export const describeAction = (action) =>
  ACTIONS[action] || { label: action, tone: "muted" };
