import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import InterviewHeader from "../../../components/InterviewHeader";
import Button from "../../../components/Button";
import AppModal from "../../../components/AppModal";
import IconTextInput from "../../../components/IconTextInput";
import styles from "../../../styles/global";

import useAuth from "../../../hooks/useAuth";
import editProfileHandler from "../../../handlers/auth/editProfileHandler";

const EditProfile = () => {
  const navigation = useNavigation();

  const { editProfile, loading } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const { handleEditProfile } = editProfileHandler({
    editProfile,
    firstName,
    lastName,
    setFirstNameError,
    setLastNameError,
    setMessage,
    setModalVisible,
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("user");

        if (savedUser) {
          const user = JSON.parse(savedUser);

          setFirstName(user.firstName || "");
          setLastName(user.lastName || "");
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    };

    loadUserProfile();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <InterviewHeader
          navigation={navigation}
          interviewLabel="Edit Profile"
          showTimer={false}
          navigateTo="Profile"
          goBack={true}
          backIcon="back"
        />

        {/* HEADER CARD */}
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
              backgroundColor: "#172554",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            <Ionicons name="person-outline" size={27} color="#60A5FA" />
          </View>

          <Text
            style={{
              color: "#F8FAFC",
              fontSize: 21,
              fontWeight: "700",
              marginBottom: 7,
            }}
          >
            Edit your profile
          </Text>

          <Text
            style={{
              color: "#A1A1AA",
              fontSize: 13,
              lineHeight: 20,
            }}
          >
            Keep your profile information up to date. Update your first and last
            name below.
          </Text>
        </View>

        {/* PERSONAL INFORMATION CARD */}
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
          {/* CARD HEADER */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                backgroundColor: "#172554",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons
                name="person-circle-outline"
                size={22}
                color="#60A5FA"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: 15,
                  fontWeight: "700",
                }}
              >
                Personal information
              </Text>

              <Text
                style={{
                  color: "#71717A",
                  fontSize: 12,
                  marginTop: 3,
                }}
              >
                Update your basic account details.
              </Text>
            </View>
          </View>

          {/* FIRST NAME */}
          <IconTextInput
            label="FIRST NAME"
            style={{ height: 55 }}
            icon="person-outline"
            placeholder="Enter your first name"
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              setFirstNameError("");
            }}
            error={firstNameError}
          />

          {firstNameError ? (
            <Text
              style={{
                color: "#F87171",
                marginTop: 5,
                width: "100%",
                fontSize: 12,
              }}
            >
              {firstNameError}
            </Text>
          ) : null}

          <View style={{ height: 18 }} />

          {/* LAST NAME */}
          <IconTextInput
            label="LAST NAME"
            style={{ height: 55 }}
            icon="person-outline"
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              setLastNameError("");
            }}
            error={lastNameError}
          />

          {lastNameError ? (
            <Text
              style={{
                color: "#F87171",
                marginTop: 5,
                width: "100%",
                fontSize: 12,
              }}
            >
              {lastNameError}
            </Text>
          ) : null}
        </View>

        {/* INFORMATION NOTE */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            paddingHorizontal: 4,
            marginBottom: 20,
          }}
        >
          <Ionicons
            name="information-circle-outline"
            size={19}
            color="#60A5FA"
            style={{ marginRight: 9, marginTop: 1 }}
          />

          <Text
            style={{
              flex: 1,
              color: "#71717A",
              fontSize: 12,
              lineHeight: 19,
            }}
          >
            Make sure your name is correct before saving your profile changes.
          </Text>
        </View>

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

      {/* BOTTOM BUTTON */}
      <Button
        title="Save Changes"
        onPress={handleEditProfile}
        loading={loading}
        disabled={loading}
        style={{
          width: "100%",
          backgroundColor: "#2563EB",
          marginBottom: 65,
        }}
      />
    </View>
  );
};

export default EditProfile;
