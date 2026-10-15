import React, { useEffect, useState } from "react";

import { View, Text, TouchableOpacity, Modal } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import styles from "../styles/global";

const InterviewHeader = ({
  navigation,
  interviewLabel,
  navigateTo,
  mockInterviewId,
  questionNumber,
  onExit,
  style,
  showTimer = true,
  timerRunning = true,
  backIcon = "back",
  timePerQuestion = 60,
}) => {
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    if (!showTimer) {
      return;
    }

    setTimeLeft(Number(timePerQuestion) || 60);
  }, [questionNumber, showTimer, timePerQuestion]);

  useEffect(() => {
    if (!showTimer || !timerRunning || timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft, showTimer, timerRunning]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  const handleBack = () => {
    if (!navigateTo) {
      return;
    }

    navigation.navigate(navigateTo, {
      mockInterviewId,
    });
  };

  const iconName = backIcon === "exit" ? "exit-outline" : "arrow-back";

  const iconColor = backIcon === "exit" ? "#DC2626" : "#F8FAFC";

  const handleExit = async () => {
    setShowExitModal(false);

    if (onExit) {
      await onExit();
    }

    if (navigateTo) {
      navigation.navigate(navigateTo, {
        mockInterviewId,
      });
    }
  };

  const handleNavigation = () => {
    if (backIcon === "exit") {
      setShowExitModal(true);
    } else {
      handleBack();
    }
  };

  return (
    <>
      <View style={[styles.header, style]}>
        <TouchableOpacity style={styles.backButton} onPress={handleNavigation}>
          <Ionicons name={iconName} size={28} color={iconColor} />
        </TouchableOpacity>

        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 15,
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "#F8FAFC",
              fontWeight: "700",
              fontSize: 20,
            }}
          >
            {interviewLabel}
          </Text>
        </View>

        {showTimer && (
          <View
            style={{
              borderWidth: 2,
              borderColor: timeLeft <= 10 ? "#DC2626" : "#2563EB",
              width: 60,
              paddingVertical: 5,
              borderRadius: 16,
            }}
          >
            <Text
              style={{
                color: timeLeft <= 10 ? "#DC2626" : "#F8FAFC",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {formatTime(timeLeft)}
            </Text>
          </View>
        )}
      </View>

      {/* Exit Confirmation Modal */}
      <Modal
        visible={showExitModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowExitModal(false);
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
            {/* Exit Icon */}
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
              <Ionicons name="exit-outline" size={30} color="#DC2626" />
            </View>

            {/* Title */}
            <Text
              style={{
                fontSize: 21,
                fontWeight: "700",
                color: "#F8FAFC",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Exit Interview
            </Text>

            {/* Message */}
            <Text
              style={{
                fontSize: 15,
                color: "#71717A",
                textAlign: "center",
                lineHeight: 22,
                marginBottom: 24,
              }}
            >
              Are you sure you want to exit this interview? Your current
              progress may be lost.
            </Text>

            {/* Buttons */}
            <View
              style={{
                flexDirection: "row",
                gap: 12,
              }}
            >
              {/* Cancel */}
              <TouchableOpacity
                onPress={() => {
                  setShowExitModal(false);
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

              {/* Exit */}
              <TouchableOpacity
                onPress={handleExit}
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#DC2626",
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 15,
                    fontWeight: "700",
                  }}
                >
                  Exit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default InterviewHeader;
