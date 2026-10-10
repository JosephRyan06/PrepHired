import React, { useEffect, useRef } from "react";
import { View, Text, Modal, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const LoadingModal = ({ visible, title, message, icon = "sync-outline" }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      rotateAnim.setValue(0);

      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      rotateAnim.stopAnimation();
      rotateAnim.setValue(0);
    }

    return () => {
      rotateAnim.stopAnimation();
    };
  }, [visible]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "80%",
            backgroundColor: "#18181B",
            borderRadius: 18,
            padding: 30,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#27272A",
          }}
        >
          <Animated.View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: "#2563EB",
              justifyContent: "center",
              alignItems: "center",
              transform: [{ rotate }],
            }}
          >
            <Ionicons name={icon} size={32} color="#FFFFFF" />
          </Animated.View>

          <Text
            style={{
              color: "#F8FAFC",
              fontSize: 18,
              fontWeight: "700",
              marginTop: 22,
            }}
          >
            {title}
          </Text>

          <Text
            style={{
              color: "#A1A1AA",
              fontSize: 14,
              textAlign: "center",
              marginTop: 8,
              lineHeight: 20,
            }}
          >
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default LoadingModal;
