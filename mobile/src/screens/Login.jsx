import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AppModal from "../components/AppModal";
import BottomNav from "../components/BottomNav";
import IconTextInput from "../components/IconTextInput";

import loginHandler from "../handlers/auth/loginHandler";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [accountType, setAccountType] = useState("student");
  const [authenticatedRole, setAuthenticatedRole] = useState("user");

  const [message, setMessage] = useState("");

  const { login, loading } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);

  const { handleLogin } = loginHandler({
    login,
    navigation,
    setMessage,
    setModalVisible,
    email,
    password,
    setEmailError,
    setPasswordError,
    accountType,
    setAuthenticatedRole,
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.loginContainer}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Image
                source={require('../../assets/PrepHiredLoginLogo.jpg')}
                style={styles.logoImage}
              />
            </View>
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subTitle}>
              Welcome back! Please enter your details.
            </Text>
          </View>

          <View style={styles.accountType} accessibilityRole="tablist">
            <TouchableOpacity
              accessibilityRole="tab"
              accessibilityState={{ selected: accountType === "student" }}
              onPress={() => setAccountType("student")}
              style={[styles.accountTypeOption, accountType === "student" && styles.accountTypeSelected]}
            >
              <Text style={[styles.accountTypeText, accountType === "student" && styles.accountTypeTextSelected]}>Student</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="tab"
              accessibilityState={{ selected: accountType === "counselor" }}
              onPress={() => setAccountType("counselor")}
              style={[styles.accountTypeOption, accountType === "counselor" && styles.accountTypeSelected]}
            >
              <Text style={[styles.accountTypeText, accountType === "counselor" && styles.accountTypeTextSelected]}>Counselor</Text>
            </TouchableOpacity>
          </View>

          <IconTextInput
            label="EMAIL"
            style={{ height: 55 }}
            icon="mail-outline"
            placeholder="Enter your email"
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

          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotPassword}>Forgot Password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
            style={[styles.button, loading && styles.buttonDisabled]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.text}>OR</Text>
            <View style={styles.line} />
          </View>

          {accountType === "student" && <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 12,
            }}
          >
            <Text style={{ color: "#A1A1AA" }}>
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.createAccountText}>
                Create an Account
              </Text>
            </TouchableOpacity>
          </View>}

          <AppModal
            visible={modalVisible}
            message={message}
            onClose={() => {
              setModalVisible(false);
              if (message === "Login successful") {
                navigation.replace(authenticatedRole === "counselor" ? "CounselorHome" : "Home");
              }
            }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  // bgcolor: 15151B
  //card color: 25252F
  //text F8FAFC
  //sub text 71717A
  // button 2563EB

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingTop: 37
  },

  loginContainer: {
    flexGrow: 1,
    backgroundColor: "#15151B",
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 20,
  },

  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#25252F",
    borderRadius: 25,
  },

  logo: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  logoImage: {
    width: 300,
    height: 150,
    resizeMode: "contain",
  },

  titleContainer: {
    marginTop: 15,
    marginBottom: 15,
  },

  accountType: {
    flexDirection: "row",
    padding: 4,
    marginBottom: 17,
    borderRadius: 10,
    backgroundColor: "#25252F",
  },

  accountTypeOption: {
    flex: 1,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
  },

  accountTypeSelected: {
    backgroundColor: "#3B82F6",
  },

  accountTypeText: {
    color: "#A1A1AA",
    fontSize: 13,
    fontWeight: "600",
  },

  accountTypeTextSelected: {
    color: "#FFFFFF",
  },

  title: {
    fontWeight: "bold",
    fontSize: 28,
    color: "#F8FAFC",
    marginBottom: 3,
  },

  subTitle: {
    fontSize: 15,
    color: "#71717A",
  },

  forgotPassword: {
    textAlign: "right",
    marginTop: 3,
    marginBottom: 10,
    marginEnd: 15,
    color: "#60A5FA",
    textDecorationLine: "underline",
    fontWeight: 600,
  },

  button: {
    height: 55,
    backgroundColor: "#2563EB",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
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

  createAccountText: {
    textAlign: "center",
    color: "#60A5FA",
    textDecorationLine: "underline",
    fontWeight: 600,
  },
});