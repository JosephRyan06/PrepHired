import React, { useEffect } from "react";
import { Modal, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AppModal({ visible, message = "", onClose }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  const getModalConfig = () => {
    // Login success
    if (message === "Login successful") {
      return {
        icon: "checkmark-circle",
        color: "#2563EB",
        title: "Success",
      };
    }

    // Registration success
    if (message === "Registration successful") {
      return {
        icon: "checkmark-circle",
        color: "#2563EB",
        title: "Success",
      };
    }

    // Account disabled
    if (message.includes("disabled")) {
      return {
        icon: "sad-outline",
        color: "#F97316",
        title: "Account Disabled",
      };
    }

    // Login rate limit
    if (message.includes("Please try again after 15 minutes.")) {
      return {
        icon: "time-outline",
        color: "#b95715",
        title: "Too Many Attempts",
      };
    }

    // Code sent success
    if (message === "Verification code has been sent.") {
      return {
        icon: "checkmark-circle",
        color: "#2563EB",
        title: "Success",
      };
    }

    if (message.includes("Verification code has been resent.")) {
      return {
        icon: "checkmark-circle",
        color: "#2563EB",
        title: "Success",
      };
    }

    if (message === "OTP verified successfully.") {
      return {
        icon: "checkmark-circle",
        color: "#2563EB",
        title: "Success",
      };
    }

    if (message.includes("Password reset successfully.")) {
      return {
        icon: "checkmark-circle",
        color: "#2563EB",
        title: "Success",
      };
    }

    if (message.includes("Password changed successfully")) {
      return {
        icon: "checkmark-circle",
        color: "#2563EB",
        title: "Success",
      };
    }

    if (message.includes("Account deleted successfully")) {
      return {
        icon: "checkmark-circle",
        color: "#2563EB",
        title: "Success",
      };
    }

    // Registration rate limit
    if (
      message.includes(
        "Too many password reset requests. Please try again after 15 minutes.",
      )
    ) {
      return {
        icon: "time-outline",
        color: "#b95715",
        title: "Too Many Attempts",
      };
    }

    if (message === "Incorrect verification code.") {
      return {
        icon: "close-circle-outline",
        color: "#EF4444",
        title: "Incorrect Code",
      };
    }

    if (message === "Unable to resend verification code") {
      return {
        icon: "time-outline",
        color: "#b95715",
        title: "Code Still Valid",
      };
    }

    if (message.includes("Resume saved successfully.")) {
      return {
        icon: "checkmark-circle",
        color: "#2563EB",
        title: "Success",
      };
    }

    if (message.includes("Failed to generate professional summary")) {
      return {
        icon: "sad-outline",
        color: "#b95715",
        title: "Try Again",
      };
    }

    if (message.includes("Admin accounts cannot log in here")) {
      return {
        icon: "sad-outline",
        color: "#EF4444",
        title: "Access Denied",
      };
    }

    if (message.includes("Failed to optimize resume")) {
      return {
        icon: "sad-outline",
        color: "#EF4444",
        title: "Try Again",
      };
    }

    if (message.includes("Failed to create mock interview")) {
      return {
        icon: "sad-outline",
        color: "#EF4444",
        title: "Try Again",
      };
    }

    if (message.includes("Failed to analyze interview answer")) {
      return {
        icon: "sad-outline",
        color: "#EF4444",
        title: "Try Again",
      };
    }

    if (message.includes("The uploaded file is not a valid resume.")) {
      return {
        icon: "sad-outline",
        color: "#EF4444",
        title: "Invalid Resume",
      };
    }

    if (
      message.includes(
        "The name on the resume does not match your account name.",
      )
    ) {
      return {
        icon: "sad-outline",
        color: "#EF4444",
        title: "Resume Mismatch",
      };
    }

    if (
      message.includes("The uploaded resume does not belong to your account.")
    ) {
      return {
        icon: "sad-outline",
        color: "#EF4444",
        title: "Resume Mismatch",
      };
    }

    // Default error
    return {
      icon: "alert-circle-outline",
      color: "#EF4444",
      title: "Error",
    };
  };

  const { icon, color, title } = getModalConfig();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            width: "85%",
            backgroundColor: "#25252F",
            borderRadius: 20,
            padding: 25,
            alignItems: "center",
            elevation: 8,
          }}
        >
          <Ionicons name={icon} size={100} color={color} />

          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 10,
              color: "#F8FAFC",
            }}
          >
            {title}
          </Text>

          <Text
            style={{
              textAlign: "center",
              marginTop: 5,
              fontSize: 15,
              color: "#71717A",
            }}
          >
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
}
