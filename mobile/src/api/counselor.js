import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/api";

const request = async (path, method = "GET", body) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_URL}/thirduser/counselor/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to load counselor workspace.");
  return data;
};

export const getCounselorDashboard = () => request("dashboard");
export const getCounselorAppointments = () => request("appointments");
export const getCounselorStudentReport = (studentId) => request(`students/${studentId}`);
export const addCounselorNote = (studentId, content) =>
  request(`students/${studentId}/notes`, "POST", { content });
export const addCounselorRecommendation = (studentId, recommendation) =>
  request(`students/${studentId}/recommendations`, "POST", recommendation);
export const updateCounselorRecommendation = (recommendationId, status) =>
  request(`recommendations/${recommendationId}`, "PUT", { status });
export const updateCounselorAppointment = (appointmentId, status) =>
  request(`appointments/${appointmentId}`, "PUT", { status });