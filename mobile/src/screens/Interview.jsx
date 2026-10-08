import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Animated,
  Easing,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import IconTextInput from "../components/IconTextInput";
import BottomNav from "../components/BottomNav";
import Button from "../components/Button";
import AppModal from "../components/AppModal";
import LoadingModal from "../components/LoadingModal";

import styles from "../styles/global";

import useMockInterview from "../hooks/useMockInterview";
import { interviewHandler } from "../handlers/interview/interviewHandler";

const Interview = () => {
  const navigation = useNavigation();

  const route = useRoute();

  const token = route.params?.token || null;

  const { create, loading } = useMockInterview();

  const [targetJob, setTargetJob] = useState("");
  const [targetJobError, setTargetJobError] = useState("");

  const [modalMessage, setModalMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedInterviewCategory, setSelectedInterviewCategory] =
    useState("All");

  const [selectedResponseMode, setSelectedResponseMode] =
    useState("Text");

  const [selectedNumberOfQuestions, setSelectedNumberOfQuestions] =
    useState("5");

  const interviewCategories = [
    "Behavioral",
    "Technical",
    "HR Screening",
    "All",
  ];

  const responseModeCategory = [
    "Text",
    "Audio",
  ];

  const numberOfQuestionsCategories = [
    "5",
    "8",
    "12",
  ];

  const {
    handleTargetJobChange,
    handleStartInterview,
  } = interviewHandler({
    targetJob,
    setTargetJob,
    setTargetJobError,
    setModalVisible,
    setModalMessage,
    selectedInterviewCategory,
    selectedResponseMode,
    selectedNumberOfQuestions,
    navigation,
    create,
    token,
  });

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
      
        <Text
          style={{
            color: "#F8FAFC",
            fontWeight: "800",
            fontSize: 24,
          }}
        >
          Mock Interview
        </Text>

        <Text
          style={{
            color: "#71717A",
            fontSize: 13,
            marginTop: 5,
            marginBottom: 18,
          }}
        >
          Practice answering interview questions and get AI-powered
          feedback on your responses.
        </Text>

        {/* TARGET JOB */}
        <View>
          <Text
            style={{
              color: "#F8FAFC",
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            TARGET JOB
          </Text>

          <IconTextInput
            style={{ marginTop: -15 }}
            icon="person-outline"
            placeholder="e.g. Software Developer"
            value={targetJob}
            onChangeText={handleTargetJobChange}
            error={targetJobError}
          />

          {targetJobError ? (
            <Text style={styles.textError}>{targetJobError}</Text>
          ) : null}
        </View>

        {/* INTERVIEW CATEGORY */}
        <View style={{ marginBottom: 24, marginTop: 15 }}>
          <Text
            style={{
              color: "#F8FAFC",
              fontSize: 14,
              fontWeight: "700",
              marginBottom: 10,
            }}
          >
            INTERVIEW TYPE
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {interviewCategories.map((category) => {
              const selected =
                selectedInterviewCategory === category;

              return (
                <TouchableOpacity
                  key={category}
                  onPress={() =>
                    setSelectedInterviewCategory(category)
                  }
                  style={{
                    paddingHorizontal: 13,
                    paddingVertical: 11,
                    borderRadius: 10,
                    backgroundColor: selected
                      ? "#2563EB"
                      : "#25252F",
                    borderWidth: 1,
                    borderColor: selected
                      ? "#2563EB"
                      : "#3F3F46",
                  }}
                >
                  <Text
                    style={{
                      color: "#F8FAFC",
                      fontSize: 13,
                      fontWeight: "600",
                    }}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* RESPONSE MODE */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              color: "#F8FAFC",
              fontSize: 14,
              fontWeight: "700",
              marginBottom: 10,
            }}
          >
            RESPONSE MODE
          </Text>

          <View
            style={{
              flexDirection: "row",
              gap: 10,
            }}
          >
            {responseModeCategory.map((mode) => {
              const selected =
                selectedResponseMode === mode;

              return (
                <TouchableOpacity
                  key={mode}
                  onPress={() => setSelectedResponseMode(mode)}
                  style={{
                    flex: 1,
                    paddingVertical: 13,
                    borderRadius: 10,
                    alignItems: "center",
                    backgroundColor: selected
                      ? "#2563EB"
                      : "#25252F",
                    borderWidth: 1,
                    borderColor: selected
                      ? "#2563EB"
                      : "#3F3F46",
                  }}
                >
                  <Text
                    style={{
                      color: "#F8FAFC",
                      fontWeight: "700",
                    }}
                  >
                    {mode}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* NUMBER OF QUESTIONS */}
        <View style={{ marginBottom: 30 }}>
          <Text
            style={{
              color: "#F8FAFC",
              fontSize: 14,
              fontWeight: "700",
              marginBottom: 10,
            }}
          >
            NUMBER OF QUESTIONS
          </Text>

          <View
            style={{
              flexDirection: "row",
              gap: 10,
            }}
          >
            {numberOfQuestionsCategories.map((number) => {
              const selected =
                selectedNumberOfQuestions === number;

              return (
                <TouchableOpacity
                  key={number}
                  onPress={() =>
                    setSelectedNumberOfQuestions(number)
                  }
                  style={{
                    flex: 1,
                    paddingVertical: 13,
                    borderRadius: 10,
                    alignItems: "center",
                    backgroundColor: selected
                      ? "#2563EB"
                      : "#25252F",
                    borderWidth: 1,
                    borderColor: selected
                      ? "#2563EB"
                      : "#3F3F46",
                  }}
                >
                  <Text
                    style={{
                      color: "#F8FAFC",
                      fontWeight: "700",
                    }}
                  >
                    {number}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* START */}
        <Button
          title={
            loading
              ? "Creating Interview..."
              : "Start Interview"
          }
          onPress={handleStartInterview}
          disabled={loading}
        />
      </ScrollView>

      <BottomNav active="interview" />

      <AppModal
        visible={modalVisible}
        message={modalMessage}
        onClose={() => {
          setModalVisible(false);
        }}
      />
      
      <LoadingModal
        visible={loading}
        title="Creating Interview"
        message="Please wait while we prepare your interview questions."
        icon="sync-outline"
      />
      
    </View>
  );
};

export default Interview;
