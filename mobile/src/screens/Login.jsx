import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
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
  });

  return (
    <View style={styles.loginContainer}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Ionicons name="notifications-outline" size={60} color="#2563EB" />
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subTitle}>
          Welcome back! Please enter your details.
        </Text>
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

      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
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

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 12,
        }}
      >
        <Text style={{ color: "#A1A1AA" }}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.createAccountText}>Create an Account</Text>
        </TouchableOpacity>
      </View>

      <AppModal
        visible={modalVisible}
        message={message}
        onClose={() => {
          setModalVisible(false);
          if (message === "Login successful") {
            navigation.replace("Home");
          }
        }}
      />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  // bgcolor: 15151B
  //card color: 25252F
  //text F8FAFC
  //sub text 71717A
  // button 2563EB

  loginContainer: {
    flex: 1,
    backgroundColor: "#15151B",
    justifyContent: "center",
    paddingStart: 25,
    paddingEnd: 25,
    marginTop: 37,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 10,
    marginStart: 50,
    marginEnd: 50,
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor: "#25252F",
    borderRadius: 25,
    borderColor: "#2563EB",
    borderWidth: 2,
  },

  logo: {},

  titleContainer: {
    marginTop: 15,
    marginBottom: 15,
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

  /*
    button: {
        flexDirection: 'row',
        height: 55,
        backgroundColor: '#172554',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        gap: 8,
        paddingHorizontal: 30,
        paddingVertical: 10
    },
    */

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
