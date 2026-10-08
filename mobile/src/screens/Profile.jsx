import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";
import LoadingModal from "../components/LoadingModal";
import Button from "../components/Button";
import ProfileHeader from "../components/ProfileHeader";
import IconTextInput from "../components/IconTextInput";
import AppModal from "../components/AppModal";
import styles from "../styles/global";

import getUserHandler from "../handlers/user/getUserHandler";
import logoutHandler from "../handlers/auth/logoutHandler";
import deleteAccountHandler from "../handlers/auth/deleteAccountHandler";
import useAuth from "../hooks/useAuth";

const Profile = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");

  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const { deleteAccount, loading } = useAuth();

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getUserHandler();
      setUser(userData);
    };
    loadUser();
  }, []);

  const { handleLogout } = logoutHandler({
    navigation,
  });

  const {
    handleDeleteAccount,
    handleDeleteAccountModalClose,
  } = deleteAccountHandler({
    deleteAccount,
    navigation,
    currentPassword,
    setCurrentPasswordError,
    setMessage,
    setModalVisible,
  });

  return (
    <View style={styles.profileContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          navigation={navigation}
          style={{
            paddingHorizontal: 25,
            paddingTop: 35,
            backgroundColor: "#25252F",
          }}
          navigateTo="Home"
        />
        <View style={styles.profileHeader}>
          {/* Profile Picture */}
          <View style={styles.profileImageContainer}>
            <Ionicons name="person-circle" size={130} color="white" />
          </View>

          {/* Name */}
          <View style={styles.profileInfo}>
            <Text style={styles.textName}>
              {user?.fullName || "Mark Vincent"}
            </Text>

            <Text style={styles.textUsername}>
              {user?.email || "v@gmail.com"}
            </Text>
          </View>
        </View>

        {/* Information Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="create-outline" size={22} color="#A1A1AA" />

            <Text style={styles.menuText}>Edit Profile</Text>

            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <Ionicons
              name="key-outline"
              size={22}
              color="#A1A1AA"
            />

            <Text style={styles.menuText}>Change Password</Text>

            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setCurrentPassword("");
              setCurrentPasswordError("");
              setShowDeleteModal(true);
            }}
          >
            <Ionicons
              name="trash-outline"
              size={22}
              color="#A1A1AA"
            />

            <Text style={styles.menuText}>Delete Account</Text>

            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("MyResumes")}
          >
            <Ionicons name="document-outline" size={22} color="#A1A1AA" />

            <Text style={styles.menuText}>My Resumes</Text>

            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("InterviewHistory")}
          >
            <Ionicons name="time-outline" size={22} color="#A1A1AA" />

            <Text style={styles.menuText}>Interview History</Text>

            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>SUPPORT</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("HelpFAQs")}
          >
            <Ionicons name="help-circle-outline" size={22} color="#A1A1AA" />

            <Text style={styles.menuText}>Helps & FAQs</Text>

            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("TermsPrivacy")}
          >
            <Ionicons
              name="document-lock-outline"
              size={22}
              color="#A1A1AA"
            />

            <Text style={styles.menuText}>Terms & Privacy Policy</Text>

            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Button
        style={{
          marginBottom: 65,
          backgroundColor: "#B91C1C",
          marginRight: 25,
          marginLeft: 25,
        }}
        title="Logout"
        onPress={handleLogout}
        icon="log-out-outline"
      />

      {/* Delete Account Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowDeleteModal(false);
          setCurrentPassword("");
          setCurrentPasswordError("");
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: 400,
              backgroundColor: "#25252F",
              borderRadius: 20,
              padding: 24,
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "#FEE2E2",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
                marginBottom: 16,
              }}
            >
              <Ionicons
                name="trash-outline"
                size={30}
                color="#DC2626"
              />
            </View>

            <Text
              style={{
                fontSize: 21,
                fontWeight: "700",
                color: "#F8FAFC",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Delete Account
            </Text>

            <Text
              style={{
                fontSize: 15,
                color: "#71717A",
                textAlign: "center",
                lineHeight: 22,
                marginBottom: 20,
              }}
            >
              This action is permanent. Your account, resumes, and
              interview data will be permanently deleted.
            </Text>

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


            <View
              style={{
                flexDirection: "row",
                gap: 12,
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setShowDeleteModal(false);
                  setCurrentPassword("");
                  setCurrentPasswordError("");
                }}
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#CBD5E1",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#F8FAFC",
                }}
              >
                <Text
                  style={{
                    color: "#334155",
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDeleteAccount}
                disabled={loading}
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: loading ? "#991B1B" : "#DC2626",
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 15,
                    fontWeight: "700",
                  }}
                >
                  {loading ? "Deleting..." : "Delete Account"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <AppModal
        visible={modalVisible}
        message={message}
        onClose={() => {
          setModalVisible(false);

          if (message.includes("Account deleted successfully")) {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: "Login",
                },
              ],
            });
          }
        }}
      />
      
      <LoadingModal
        visible={loading}
        title="Deleting Account"
        message="Please wait while your account and all associated data are being deleted."
        icon="trash-outline"
      />
    </View>
  );
};

export default Profile;