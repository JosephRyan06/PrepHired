import { API_URL } from "../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/mobile/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
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

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/mobile/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
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

export const forgotPassword = async (email) => {
  const response = await fetch(`${API_URL}/mobile/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
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

export const verifyOtp = async (email, otp) => {
  const response = await fetch(`${API_URL}/mobile/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      otp,
    }),
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

export const resetPassword = async (resetToken, password, confirmPassword) => {
  const response = await fetch(`${API_URL}/mobile/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resetToken,
      password,
      confirmPassword,
    }),
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

export const resendOtp = async (email) => {
  const response = await fetch(`${API_URL}/mobile/auth/resend-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
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

export const changePassword = async (
  currentPassword,
  newPassword,
  confirmPassword,
  token,
) => {
  const response = await fetch(`${API_URL}/mobile/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
      confirmPassword,
    }),
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

export const deleteAccount = async (currentPassword) => {
  const token = await AsyncStorage.getItem("token");

  const response = await fetch(`${API_URL}/mobile/auth/delete-account`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currentPassword,
    }),
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
