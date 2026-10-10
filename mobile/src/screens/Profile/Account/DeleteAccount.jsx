import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import InterviewHeader from "../../../components/InterviewHeader";
import Button from "../../../components/Button";
import AppModal from "../../../components/AppModal";
import IconTextInput from "../../../components/IconTextInput";
import LoadingModal from "../../../components/LoadingModal";
import styles from "../../../styles/global";

import useAuth from "../../../hooks/useAuth";
import deleteAccountHandler from "../../../handlers/auth/deleteAccountHandler";

const DeleteAccount = () => {
  const navigation = useNavigation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");

  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const { deleteAccount, loading } = useAuth();

  const { handleDeleteAccount, handleDeleteAccountModalClose } =
    deleteAccountHandler({
      deleteAccount,
      navigation,
      currentPassword,
      setCurrentPasswordError,
      setMessage,
      setModalVisible,
      setCurrentPassword,
    });

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <InterviewHeader
          navigation={navigation}
          interviewLabel="Delete Account"
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
              backgroundColor: "#7F1D1D",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            <Ionicons name="trash-outline" size={27} color="#FCA5A5" />
          </View>

          <Text
            style={{
              color: "#F8FAFC",
              fontSize: 21,
              fontWeight: "700",
              marginBottom: 7,
            }}
          >
            Delete your account
          </Text>

          <Text
            style={{
              color: "#A1A1AA",
              fontSize: 13,
              lineHeight: 20,
            }}
          >
            We're sorry to see you go. Please review the information below
            before permanently deleting your account.
          </Text>
        </View>

        {/* WARNING CARD */}
        <View
          style={{
            backgroundColor: "#25252F",
            borderRadius: 14,
            borderWidth: 1,
            borderColor: "#30303B",
            overflow: "hidden",
            marginBottom: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 15,
              borderBottomWidth: 1,
              borderBottomColor: "#30303B",
            }}
          >
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                backgroundColor: "#3F2027",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons name="alert-circle-outline" size={20} color="#F87171" />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: 15,
                  fontWeight: "700",
                }}
              >
                This action is permanent
              </Text>

              <Text
                style={{
                  color: "#71717A",
                  fontSize: 12,
                  marginTop: 3,
                }}
              >
                Your account cannot be recovered after deletion.
              </Text>
            </View>
          </View>

          <View style={{ padding: 15 }}>
            {[
              "Your account information will be deleted.",
              "Your saved resumes will be permanently removed.",
              "Your interview history and associated data will be deleted.",
            ].map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginBottom: index === 2 ? 0 : 13,
                }}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={18}
                  color="#F87171"
                  style={{ marginRight: 10, marginTop: 1 }}
                />

                <Text
                  style={{
                    flex: 1,
                    color: "#A1A1AA",
                    fontSize: 13,
                    lineHeight: 20,
                  }}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* PASSWORD CARD */}
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
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
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
              <Ionicons name="lock-closed-outline" size={20} color="#60A5FA" />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: 15,
                  fontWeight: "700",
                }}
              >
                Verify your identity
              </Text>

              <Text
                style={{
                  color: "#71717A",
                  fontSize: 12,
                  marginTop: 3,
                }}
              >
                Enter your current password to continue.
              </Text>
            </View>
          </View>

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
                color: "#F87171",
                marginTop: 5,
                width: "100%",
                fontSize: 12,
              }}
            >
              {currentPasswordError}
            </Text>
          ) : null}
        </View>

        {/* CONFIRMATION NOTE */}
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
            Make sure you have saved any information you need before continuing.
            You must verify your password to delete your account.
          </Text>
        </View>

        <AppModal
          visible={modalVisible}
          message={message}
          onClose={handleDeleteAccountModalClose}
        />
      </ScrollView>

      <Button
        title="Delete Account"
        onPress={handleDeleteAccount}
        loading={loading}
        disabled={loading}
        icon="trash-outline"
        style={{
          width: "100%",
          backgroundColor: "#B91C1C",
          marginBottom: 65,
        }}
      />
    </View>
  );
};

export default DeleteAccount;
