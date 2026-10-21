import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/api";

const request = async (path, method = "GET", body) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_URL}/thirduser/student/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to load career counseling.");
  return data;
};

export const getStudentCounseling = () => request("counseling");
export const requestCounselingAppointment = (appointment) =>
  request("appointments", "POST", appointment);
export const completeCounselingRecommendation = (recommendationId) =>
  request(`recommendations/${recommendationId}`, "PUT", { status: "completed" });