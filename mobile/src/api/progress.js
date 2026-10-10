import { API_URL } from "../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getProgress = async () => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/mobile/progress`, {
    method: "GET",
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message,
      errors: data.errors || {},
    };
  }

  return data;
};
