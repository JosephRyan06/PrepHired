import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const WelcomeScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Image
          source={require('../../assets/PrepHiredLogo.jpg')}
          style={styles.logo}
        />
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15151B",
    justifyContent: "center",
    alignItems: "center",
    padding: 100,
    marginTop: 37
  },

  logo: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: "#25252F",
    alignItems: "center",
    justifyContent: "center",
  },
});