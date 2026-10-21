const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");
const TOKEN_KEY = "prephired_counselor_token";
const COUNSELOR_KEY = "prephired_counselor_profile";

export const getCounselorSession = () => {
  let counselor = null;
  try {
    counselor = JSON.parse(localStorage.getItem(COUNSELOR_KEY) || "null");
  } catch {
    localStorage.removeItem(COUNSELOR_KEY);
  }
  return { token: localStorage.getItem(TOKEN_KEY), counselor };
};

export const clearCounselorSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(COUNSELOR_KEY);
};

const request = async (path, { method = "GET", body, auth = true } = {}) => {
  let response;
  try {
    response = await fetch(`${API_URL}/counselor${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(auth ? { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Make sure the backend is running.");
  }

  const data = await response.json().catch(() => ({}));
  if (auth && response.status === 401) {
    clearCounselorSession();
    window.location.assign("/counselor/login");
  }
  if (!response.ok) throw new Error(data.message || "The request could not be completed.");
  return data;
};

export const counselorApi = {
  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password }, auth: false }),
  saveSession: (token, counselor) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(COUNSELOR_KEY, JSON.stringify(counselor));
  },
  dashboard: () => request("/dashboard"),
  appointments: () => request("/appointments"),
  student: (studentId) => request(`/students/${studentId}`),
  addNote: (studentId, content) => request(`/students/${studentId}/notes`, { method: "POST", body: { content } }),
  addRecommendation: (studentId, recommendation) => request(`/students/${studentId}/recommendations`, { method: "POST", body: recommendation }),
  updateRecommendation: (recommendationId, status) => request(`/recommendations/${recommendationId}`, { method: "PUT", body: { status } }),
  updateAppointment: (appointmentId, status) => request(`/appointments/${appointmentId}`, { method: "PUT", body: { status } }),
};