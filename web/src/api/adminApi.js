const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const TOKEN_KEY = "prephired_admin_token";
const ADMIN_KEY = "prephired_admin_profile";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

/* ----------------------------- session ------------------------------ */

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getAdmin = () => {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_KEY));
  } catch {
    return null;
  }
};

export const setSession = (token, admin) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
};

/* ------------------------------ request ----------------------------- */

const toQuery = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const text = query.toString();

  return text ? `?${text}` : "";
};

const request = async (path, { method = "GET", body, auth = true } = {}) => {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    headers.Authorization = `Bearer ${getToken()}`;
  }

  let response;

  try {
    response = await fetch(`${API_URL}/admin${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Cannot reach the server. Make sure the backend is running.",
      0,
    );
  }

  const data = await response.json().catch(() => ({}));

  // An expired or invalid token sends the admin back to the login page
  if (auth && response.status === 401) {
    clearSession();
    window.location.assign("/login");
    throw new ApiError("Your session has expired. Please log in again.", 401);
  }

  if (!response.ok) {
    throw new ApiError(data.message || "Something went wrong", response.status);
  }

  return data;
};

/* ------------------------------ endpoints --------------------------- */

export const adminApi = {
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    }),

  me: () => request("/auth/me"),

  dashboard: () => request("/dashboard"),

  users: (params) => request(`/users${toQuery(params)}`),
  user: (id) => request(`/users/${id}`),
  setUserStatus: (id, isEnabled) =>
    request(`/users/${id}/status`, { method: "PATCH", body: { isEnabled } }),

  // Counselor provisioning stays within the authenticated upstream admin session.
  counselors: () => request("/counselors"),
  createCounselor: (counselor) =>
    request("/counselors", { method: "POST", body: counselor }),
  assignCounselorStudents: (counselorId, studentIds) =>
    request(`/counselors/${counselorId}/assignments`, {
      method: "PUT",
      body: { studentIds },
    }),

  resumes: (params) => request(`/resumes${toQuery(params)}`),
  interviews: (params) => request(`/interviews${toQuery(params)}`),

  auditLogs: (params) => request(`/audit-logs${toQuery(params)}`),

  // Returns the CSV file as a Blob
  exportAuditLogs: async (params) => {
    let response;

    try {
      response = await fetch(`${API_URL}/admin/audit-logs/export${toQuery(params)}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
    } catch {
      throw new ApiError(
        "Cannot reach the server. Make sure the backend is running.",
        0,
      );
    }

    if (response.status === 401) {
      clearSession();
      window.location.assign("/login");
      throw new ApiError("Your session has expired. Please log in again.", 401);
    }

    if (!response.ok) {
      throw new ApiError("Could not export the audit log", response.status);
    }

    return response.blob();
  },
};
