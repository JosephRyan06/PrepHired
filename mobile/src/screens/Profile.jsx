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
import styles from "../styles/global";

import getUserHandler from "../handlers/user/getUserHandler";
import logoutHandler from "../handlers/auth/logoutHandler";
import useAuth from "../hooks/useAuth";

const Profile = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState(null);

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

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Ionicons name="create-outline" size={22} color="#A1A1AA" />

            <Text style={styles.menuText}>Edit Profile</Text>

            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <Ionicons name="key-outline" size={22} color="#A1A1AA" />

            <Text style={styles.menuText}>Change Password</Text>

            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("DeleteAccount")}
          >
            <Ionicons name="trash-outline" size={22} color="#A1A1AA" />

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
            <Ionicons name="document-lock-outline" size={22} color="#A1A1AA" />

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
    </View>
  );
};

export default Profile;
