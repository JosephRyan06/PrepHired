import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import IconTextInput from "../components/IconTextInput";
import AppModal from "../components/AppModal";
import Button from "../components/Button";
import { Ionicons } from "@expo/vector-icons";

import useAuth from "../hooks/useAuth";
import resetPasswordHandler from "../handlers/auth/resetPasswordHandler";

const ResetPassword = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { resetToken } = route.params || {};

  const { resetPassword, loading } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const { handleResetPassword } = resetPasswordHandler({
    resetPassword,
    navigation,
    resetToken,
    password,
    confirmPassword,
    setPasswordError,
    setConfirmPasswordError,
    setMessage,
    setModalVisible,
  });

  const passwordRequirements = [
    {
      label: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      label: "No more than 16 characters",
      met: password.length <= 16 && password.length > 0,
    },
    {
      label: "At least one uppercase letter (A-Z)",
      met: /[A-Z]/.test(password),
    },
    {
      label: "At least one number (0-9)",
      met: /[0-9]/.test(password),
    },
    {
      label: "At least one special character (@, #, !)",
      met: /[^A-Za-z0-9\s]/.test(password),
    },
    {
      label: "No spaces",
      met: password.length > 0 && !/\s/.test(password),
    },
  ];

  return (

    <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Ionicons name="arrow-back-outline" size={35} color="#F8FAFC" />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed-outline" size={60} color="#2563EB" />
        </View>

        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subTitle}>Set your new password securely.</Text>

        <IconTextInput
          label="NEW PASSWORD"
          style={{ height: 55 }}
          icon="lock-closed-outline"
          placeholder="Enter your new password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError("");
          }}
          secureTextEntry={true}
          error={passwordError}
        />

        {passwordError ? (
          <Text
            style={{
              color: "#B91C1C",
              marginTop: 0,
              width: "100%",
              fontSize: 12,
            }}
          >
            {passwordError}
          </Text>
        ) : null}

        {password.length > 0 && (
          <View style={styles.passwordRequirements}>
            <Text style={styles.requirementsTitle}>Password requirements</Text>

            {passwordRequirements.map((requirement, index) => (
              <View key={index} style={styles.requirementRow}>
                <Ionicons
                  name={
                    requirement.met
                      ? "checkmark-circle"
                      : "close-circle-outline"
                  }
                  size={16}
                  color={requirement.met ? "#60A5FA" : "#A1A1AA"}
                />

                <Text
                  style={[
                    styles.requirementText,
                    requirement.met && styles.requirementMet,
                  ]}
                >
                  {requirement.label}
                </Text>
              </View>
            ))}
          </View>
        )}

        <IconTextInput
          label="CONFIRM PASSWORD"
          style={{ height: 55 }}
          icon="lock-closed-outline"
          placeholder="Re-enter your new password"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setConfirmPasswordError("");
          }}
          secureTextEntry={true}
          error={confirmPasswordError}
        />

        {confirmPasswordError ? (
          <Text
            style={{
              color: "#B91C1C",
              marginTop: 0,
              width: "100%",
              fontSize: 12,
            }}
          >
            {confirmPasswordError}
          </Text>
        ) : null}

        <Button
          title="Submit"
          onPress={handleResetPassword}
          loading={loading}
          style={{ width: "100%" }}
        />
      </View>

      <AppModal
        visible={modalVisible}
        message={message}
        onClose={() => {
          setModalVisible(false);

          if (message === "Password reset successfully.") {
            setTimeout(() => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "Login",
                  },
                ],
              });
            }, 100);
          }
        }}
      />
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({

  keyboardContainer: {
    flex: 1,
    backgroundColor: "white",
  },


  container: {
    flex: 1,
    backgroundColor: "#15151B",
    marginTop: 37,
  },

  content: {
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 120,
  },

  backButtonContainer: {
    paddingBottom: 30,
  },

  formContainer: {
    width: "100%",
    alignItems: "center",
  },

  iconContainer: {
    width: 150,
    height: 150,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 25,

    backgroundColor: "#25252F",

    borderRadius: 25,
  },

  title: {
    color: "#F8FAFC",

    fontSize: 28,
    fontWeight: "700",

    textAlign: "center",

    marginBottom: 10,
  },

  subTitle: {
    fontSize: 15,
    color: "#71717A",
    marginBottom: 20,
  },

  createAccountText: {
    textAlign: "center",
    color: "#60A5FA",
    textDecorationLine: "underline",
    fontWeight: 600,
  },

  passwordRequirements: {
    width: "100%",
    marginTop: 8,
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#1E1E26",
    borderRadius: 10,
  },

  requirementsTitle: {
    color: "#F8FAFC",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },

  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },

  requirementText: {
    color: "#A1A1AA",
    fontSize: 12,
  },

  requirementMet: {
    color: "#60A5FA",
  },
});
