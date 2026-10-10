import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/global";

const ResumeHeader = ({
  navigation,
  resumeLabel,
  navigateTo,
  resumeId,
  style,

  rightIcon = "home-outline",
  onRightPress,
  rightIconDisabled = false,
}) => {
  const handleBack = () => {
    navigation.navigate(navigateTo, {
      resumeId,
    });
  };

  const handleHome = () => {
    navigation.navigate("Home");
  };

  const handleRightPress = () => {
    if (onRightPress) {
      onRightPress();
    } else {
      handleHome();
    }
  };

  return (
    <View style={[styles.header, style]}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back-outline" size={28} color="#F8FAFC" />
      </TouchableOpacity>

      {/* Header Title */}
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
          {resumeLabel}
        </Text>
      </View>

      {/* Right Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleRightPress}
        disabled={rightIconDisabled}
      >
        <Ionicons
          name={rightIcon}
          size={28}
          color={rightIconDisabled ? "#94A3B8" : "#F8FAFC"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ResumeHeader;
