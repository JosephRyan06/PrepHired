import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import Checkbox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";
import AppModal from "../components/AppModal";
import IconTextInput from "../components/IconTextInput";
import { Ionicons } from "@expo/vector-icons";

import registerHandler from "../handlers/auth/registerHandler";
import useAuth from "../hooks/useAuth";

const Register = () => {
  const navigation = useNavigation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termsConditionError, setTermsConditionError] = useState("");

  const [checked, setChecked] = useState(false);

  const [message, setMessage] = useState("");

  const { register, loading } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);

  const { handleRegister } = registerHandler({
    register,
    navigation,
    setMessage,
    setModalVisible,

    fullName,
    email,
    password,
    confirmPassword,
    checked,

    setFullNameError,
    setEmailError,
    setPasswordError,
    setConfirmPasswordError,
    setTermsConditionError,
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
    <ScrollView
      style={styles.registerContainer}
      contentContainerStyle={styles.registerContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.backButtonContainer}>
        <View style={styles.backButton}>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Ionicons name="arrow-back-outline" size={35} color="#F8FAFC" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subTitle}>Sign up and enjoy our services.</Text>
      </View>

      <IconTextInput
        label="FULL NAME"
        style={{ height: 55 }}
        icon="mail-outline"
        placeholder="Enter your name"
        value={fullName}
        onChangeText={(text) => {
          setFullName(text);
          setFullNameError("");
        }}
        error={fullNameError}
      />

      {fullNameError ? (
        <Text style={{ color: "#B91C1C", marginTop: 0, fontSize: 12 }}>
          {fullNameError}
        </Text>
      ) : null}

      <IconTextInput
        label="EMAIL"
        style={{ height: 55 }}
        icon="mail-outline"
        placeholder="Enter your email address"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setEmailError("");
        }}
        keyboardType="email-address"
        error={emailError}
      />

      {emailError ? (
        <Text style={{ color: "#B91C1C", marginTop: 0, fontSize: 12 }}>
          {emailError}
        </Text>
      ) : null}

      <IconTextInput
        label="PASSWORD"
        style={{ height: 55 }}
        icon="lock-closed-outline"
        placeholder="Enter your password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setPasswordError("");
        }}
        secureTextEntry={true}
        error={passwordError}
      />

      {passwordError ? (
        <Text style={{ color: "#B91C1C", marginTop: 0, fontSize: 12 }}>
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
                  requirement.met ? "checkmark-circle" : "close-circle-outline"
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
        placeholder="Re-enter your password"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setConfirmPasswordError("");
        }}
        secureTextEntry={true}
        error={confirmPasswordError}
      />

      {confirmPasswordError ? (
        <Text style={{ color: "#B91C1C", marginTop: 0, fontSize: 12 }}>
          {confirmPasswordError}
        </Text>
      ) : null}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <Checkbox
          style={{ height: 20, width: 20, marginStart: 5 }}
          value={checked}
          onValueChange={setChecked}
          color={checked ? "#2563EB" : undefined}
        />

        <Text style={{ color: "#A1A1AA", marginLeft: 10 }}>
          I agree to the Terms and Conditions
        </Text>
      </View>

      {termsConditionError ? (
        <Text style={{ color: "#B91C1C", marginTop: 0, fontSize: 12 }}>
          {termsConditionError}
        </Text>
      ) : null}

      <TouchableOpacity
        onPress={handleRegister}
        style={[styles.button, loading && styles.buttonDisabled]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.text}>OR</Text>
        <View style={styles.line} />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 12,
        }}
      >
        <Text style={{ color: "#A1A1AA" }}>Do you have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.haveAccountText}>Login</Text>
        </TouchableOpacity>
      </View>

      <AppModal
        visible={modalVisible}
        message={message}
        onClose={() => {
          setModalVisible(false);
          if (message === "Registration successful") {
            navigation.replace("Login");
          }
        }}
      />
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({
  registerContainer: {
    flex: 1,
    backgroundColor: "#15151B",
    marginTop: 37,
  },

  registerContent: {
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 40,
    paddingBottom: 120,
  },

  backButtonContainer: {
    paddingBottom: 30,
  },

  backButton: {},

  registerCard: {
    paddingHorizontal: 25,
    paddingVertical: 50,
    marginStart: 20,
    marginEnd: 20,
    backgroundColor: "#1E1E26",
    borderRadius: 25,
  },

  titleContainer: {
    marginBottom: 25,
  },

  title: {
    fontWeight: "bold",
    fontSize: 35,
    color: "#F8FAFC",
    marginBottom: 3,
  },
  subTitle: {
    color: "#A1A1AA",
    fontSize: 15,
  },

  /*
   button: {
    flexDirection: 'row',
    height: 55,
    backgroundColor: '#172554',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 8
    },
  */
  button: {
    height: 55,

    backgroundColor: "#2563EB",

    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",

    marginTop: 10,

    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "600",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#D1D5DB",
    marginLeft: 8,
    marginRight: 8,
  },

  text: {
    marginHorizontal: 12,
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },

  haveAccountText: {
    textAlign: "center",
    //color: '#2563EB',
    color: "#60A5FA",
    textDecorationLine: "underline",
    fontWeight: "600",
  },

  messageText: {
    color: "#F87171",
    marginTop: 5,
    marginBottom: 5,
  },

  passwordRequirements: {
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
