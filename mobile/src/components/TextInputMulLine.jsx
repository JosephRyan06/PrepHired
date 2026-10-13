import React from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";

const TextInputMulLine = ({
  label,
  style,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  error,
  height = 180,
}) => {
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={[styles.input, { height }, style, error && styles.errorBorder]}
        placeholder={placeholder}
        placeholderTextColor="#71717A"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={true}
        textAlignVertical="top"
      />
    </View>
  );
};

export default TextInputMulLine;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginVertical: 5,
  },

  label: {
    color: "#F8FAFC",
    fontSize: 12,
    fontWeight: "600",
    marginStart: 5,
    marginBottom: 10,
  },

  input: {
    width: "100%",
    backgroundColor: "#25252F",
    borderWidth: 1,
    borderColor: "#2D2D38",
    borderRadius: 16,
    padding: 15,
    fontSize: 14,
    color: "#F8FAFC",
    textAlignVertical: "top",
  },

  errorBorder: {
    borderColor: "#B91C1C",
    borderWidth: 1,
  },
});
