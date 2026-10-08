import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import ResumeHeader from "../../../components/ResumeHeader";
import InterviewHeader from "../../../components/InterviewHeader";
import Button from "../../../components/Button";
import AppModal from "../../../components/AppModal";
import IconTextInput from "../../../components/IconTextInput";
import styles from "../../../styles/global";

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
  const {
    changePassword,
    loading,
  } = useAuth();

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