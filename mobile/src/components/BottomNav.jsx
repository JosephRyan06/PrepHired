import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useNavigation } from "@react-navigation/native";

export default function BottomNav({ active }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Ionicons
          name={active === "home" ? "home" : "home-outline"}
          size={25}
          color={active === "home" ? "#F8FAFC" : "#777"}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Resume")}>
        <Ionicons
          name={active === "resume" ? "document-text" : "document-text-outline"}
          size={25}
          color={active === "resume" ? "#F8FAFC" : "#777"}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Interview")}
        style={styles.addButton}
      >
        <Ionicons
          name={active === "interview" ? "mic" : "mic-outline"}
          size={25}
          color={active === "interview" ? "#F8FAFC" : "#F8FAFC"}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Progress")}>
        <Ionicons
          name={active === "progress" ? "bar-chart" : "bar-chart-outline"}
          size={25}
          color={active === "progress" ? "#F8FAFC" : "#777"}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <Ionicons
          name={active === "profile" ? "person" : "person-outline"}
          size={25}
          color={active === "profile" ? "#F8FAFC" : "#777"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#25252F",
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 10,
  },

  addButton: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "#2563EB",
    shadowColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
