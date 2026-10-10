import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/global";

const Header = ({ navigation, resumeLabel, navigateTo, resumeId, style }) => {
  const handleBack = () => {
    navigation.navigate(navigateTo, {
      resumeId,
    });
  };
  const handleHome = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={[styles.header, style]}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <View>
          <Ionicons name="arrow-back-outline" size={28} color="#F8FAFC" />
        </View>
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
          {resumeLabel}
        </Text>
      </View>
      <TouchableOpacity style={styles.backButton} onPress={handleHome}>
        <View>
          <Ionicons name="home-outline" size={28} color="#F8FAFC" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
