import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";

import { useNavigation } from "@react-navigation/native";

import ResumeHeader from "../../../components/ResumeHeader";
import InterviewHeader from "../../../components/InterviewHeader";
import Button from "../../../components/Button";
import AppModal from "../../../components/AppModal";
import IconTextInput from "../../../components/IconTextInput";
import styles from "../../../styles/global";
import { Ionicons } from "@expo/vector-icons";

import useAuth from "../../../hooks/useAuth";
import changePasswordHandler from "../../../handlers/auth/changePasswordHandler";

const ChangePassword = () => {
  const navigation = useNavigation();

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error states
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Modal states
  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // Auth hook
  const { changePassword, loading } = useAuth();

  // Change password handler
  const { handleChangePassword } = changePasswordHandler({
    changePassword,
    navigation,
    currentPassword,
    newPassword,
    confirmPassword,
    setCurrentPasswordError,
    setNewPasswordError,
    setConfirmPasswordError,
    setMessage,
    setModalVisible,
  });

  const passwordRequirements = [
    {
      label: "At least 8 characters",
      met: newPassword.length >= 8,
    },
    {
      label: "No more than 16 characters",
      met: newPassword.length <= 16 && newPassword.length > 0,
    },
    {
      label: "At least one uppercase letter (A-Z)",
      met: /[A-Z]/.test(newPassword),
    },
    {
      label: "At least one number (0-9)",
      met: /[0-9]/.test(newPassword),
    },
    {
      label: "At least one special character (@, #, !)",
      met: /[^A-Za-z0-9\s]/.test(newPassword),
    },
    {
      label: "No spaces",
      met: newPassword.length > 0 && !/\s/.test(newPassword),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <InterviewHeader
          navigation={navigation}
          interviewLabel="Change Password"
          showTimer={false}
          navigateTo="Profile"
          goBack={true}
          backIcon="back"
        />

        <View
          style={{
            backgroundColor: "#25252F",
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: "#30303B",
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              backgroundColor: "#1D4ED8",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            <Ionicons name="lock-closed-outline" size={27} color="#FFFFFF" />
          </View>

          <Text
            style={{
              color: "#F8FAFC",
              fontSize: 21,
              fontWeight: "700",
              marginBottom: 7,
            }}
          >
            Change your password
          </Text>

          <Text
            style={{
              color: "#A1A1AA",
              fontSize: 13,
              lineHeight: 20,
            }}
          >
            Update your password to help keep your account secure.
          </Text>
        </View>

        {/* CURRENT PASSWORD */}
        <IconTextInput
          label="CURRENT PASSWORD"
          style={{ height: 55 }}
          icon="lock-closed-outline"
          placeholder="Enter your current password"
          value={currentPassword}
          onChangeText={(text) => {
            setCurrentPassword(text);
            setCurrentPasswordError("");
          }}
          secureTextEntry={true}
          error={currentPasswordError}
        />

        {currentPasswordError ? (
          <Text
            style={{
              color: "#B91C1C",
              marginTop: 0,
              width: "100%",
              fontSize: 12,
            }}
          >
            {currentPasswordError}
          </Text>
        ) : null}

        {/* NEW PASSWORD */}
        <IconTextInput
          label="NEW PASSWORD"
          style={{ height: 55 }}
          icon="lock-closed-outline"
          placeholder="Enter your new password"
          value={newPassword}
          onChangeText={(text) => {
            setNewPassword(text);
            setNewPasswordError("");
          }}
          secureTextEntry={true}
          error={newPasswordError}
        />

        {newPasswordError ? (
          <Text
            style={{
              color: "#B91C1C",
              marginTop: 0,
              width: "100%",
              fontSize: 12,
            }}
          >
            {newPasswordError}
          </Text>
        ) : null}

        {newPassword.length > 0 && (
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

        {/* CONFIRM PASSWORD */}
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

        {/* SUBMIT */}
        <Button
          title="Save"
          onPress={handleChangePassword}
          loading={loading}
          disabled={loading}
          style={{
            width: "100%",
          }}
        />

        <AppModal
          visible={modalVisible}
          message={message}
          onClose={() => {
            setModalVisible(false);

            setTimeout(() => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "Profile",
                  },
                ],
              });
            }, 100);
          }}
        />
      </ScrollView>
    </View>
  );
};

export default ChangePassword;
