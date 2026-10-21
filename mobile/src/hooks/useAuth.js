import { useState } from "react";
import {
  loginUser,
  loginCounselor,
  registerUser,
  forgotPassword as forgotPasswordApi,
  verifyOtp as verifyOtpApi,
  resetPassword as resetPasswordApi,
  resendOtp as resendOtpApi,
  changePassword as changePasswordApi,
  deleteAccount as deleteAccountApi,
  editProfile as editProfileApi,
} from "../api/mobileAuth";

import AsyncStorage from "@react-native-async-storage/async-storage";

const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const login = async (email, password, accountType = "student") => {
    setLoading(true);

    try {
      const data = accountType === "counselor"
        ? await loginCounselor(email, password)
        : await loginUser(email, password);

      if (accountType === "counselor" && data.user?.role !== "counselor") {
        return {
          success: false,
          message: "Administrator accounts can only sign in on the web.",
          errors: { general: "Administrator accounts can only sign in on the web." },
        };
      }

      // Save JWT token
      await AsyncStorage.setItem("token", data.token);

      // Save logged-in user information
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      return {
        success: true,
        message: data.message,
        token: data.token,
        user: data.user,
        errors: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Login failed",
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);

    try {
      const data = await registerUser(userData);

      return {
        success: true,
        message: data.message,
        user: data.user,
        errors: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Registration failed",
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const data = await forgotPasswordApi(email);

      return {
        success: true,
        message: data.message,
        errors: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Something went wrong",
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const data = await verifyOtpApi(email, otp);

      return {
        success: true,
        message: data.message,
        resetToken: data.resetToken,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to verify OTP",
        errors: error.errors || {},
      };
    }
  };

  const resetPassword = async (resetToken, password, confirmPassword) => {
    try {
      const data = await resetPasswordApi(
        resetToken,
        password,
        confirmPassword,
      );

      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to reset password",
        errors: error.errors || {},
      };
    }
  };

  const resendOtp = async (email) => {
    setLoading(true);
    try {
      const data = await resendOtpApi(email);

      return {
        success: true,
        message: data.message,
        errors: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Something went wrong",
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (
    currentPassword,
    newPassword,
    confirmPassword,
  ) => {
    setLoading(true);

    try {
      // Get JWT token saved during login
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        return {
          success: false,
          message: "You are not logged in",
          errors: {},
        };
      }

      // Call API
      const data = await changePasswordApi(
        currentPassword,
        newPassword,
        confirmPassword,
        token,
      );

      return {
        success: true,
        message: data.message,
        errors: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to change password",
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (currentPassword) => {
    setLoading(true);

    try {
      const data = await deleteAccountApi(currentPassword);

      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");

      return {
        success: true,
        message: data.message,
        errors: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to delete account",
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  const editProfile = async (firstName, lastName) => {
    setLoading(true);

    try {
      const data = await editProfileApi(firstName, lastName);

      const savedUser = await AsyncStorage.getItem("user");
      const currentUser = savedUser ? JSON.parse(savedUser) : {};

      const updatedUser = {
        ...currentUser,
        ...(data.user ?? {}),
        firstName,
        lastName,
      };

      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      return {
        success: true,
        message: data.message || "Profile updated successfully",
        user: updatedUser,
        errors: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to update profile",
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    register,
    forgotPassword,
    verifyOtp,
    resetPassword,
    resendOtp,
    changePassword,
    deleteAccount,
    editProfile,
    loading,
  };
};

export default useAuth;
