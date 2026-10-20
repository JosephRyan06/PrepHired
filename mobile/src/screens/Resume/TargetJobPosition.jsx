import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import ResumeHeader from "../../components/ResumeHeader";
import Button from "../../components/Button";
import IconTextInput from "../../components/IconTextInput";
import TextInputMulLine from "../../components/TextInputMulLine";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/global";

import useResume from "../../hooks/useResume";
import { targetJobHandler } from "../../handlers/resume/targerJobHandler";

const TargetJobPosition = ({ navigation }) => {
  const route = useRoute();

  const { resumeId } = route.params;

  const { getById, saveTarget, loading } = useResume();

  const [jobTitle, setJobTitle] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [jobTitleError, setJobTitleError] = useState("");
  const [selectedIndustryError, setSelectedIndustryError] = useState("");
  const [jobDescriptionError, setJobDescriptionError] = useState("");

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Engineering",
    "Marketing",
    "Sales",
    "Education",
    "Manufacturing",
    "Other",
  ];

  const { loadTargetJobResume, handleTargetJobNext } = targetJobHandler({
    resumeId,

    jobTitle,
    selectedIndustry,
    jobDescription,

    setJobTitle,
    setSelectedIndustry,
    setJobDescription,

    setJobTitleError,
    setSelectedIndustryError,
    setJobDescriptionError,

    getById,
    saveTarget,
    navigation,
  });

  // LOAD RESUME
  useEffect(() => {
    loadTargetJobResume();
  }, []);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ResumeHeader
          navigation={navigation}
          resumeLabel="Target Job & Position"
          resumeId={resumeId}
          navigateTo="BasicInfo"
        />
        <Text
          style={{
            textAlign: "center",
            color: "#F8FAFC",
            fontWeight: "500",
            marginBottom: 10,
          }}
        >
          2/8
        </Text>
        <View
          style={{
            backgroundColor: "#25252F",
            width: "100%",
            height: 8,
            borderRadius: 10,
            overflow: "hidden",
            marginBottom: 20,
          }}
        >
          <View style={[styles.percent, { width: "33.3%" }]} />
        </View>

        <Text
          style={{
            color: "#F8FAFC",
            fontSize: 15,
            fontWeight: "700",
            marginBottom: 5,
          }}
        >
          What role are you targetting?
        </Text>
        <Text
          style={{
            color: "#A1A1AA",
            fontSize: 13,
            fontWeight: "500",
            marginBottom: 15,
          }}
        >
          Specify your target role to help us tailor your resume to the
          position.
        </Text>

        <IconTextInput
          label="JOB TITLE"
          style={{ height: 55 }}
          icon="person-outline"
          placeholder="eg. Software Developer"
          value={jobTitle}
          onChangeText={(text) => {
            setJobTitle(text);
            setJobTitleError("");
          }}
          keyboardType="default"
          error={jobTitleError}
        />

        {jobTitleError ? (
          <Text style={styles.textError}>{jobTitleError}</Text>
        ) : null}

        <Text
          style={{
            color: "#F8FAFC",
            fontSize: 12,
            fontWeight: "600",
            marginStart: 5,
            marginTop: 10,
            marginBottom: 8,
          }}
        >
          INDUSTRY
        </Text>

        <View style={styles.industryContainer}>
          {industries.map((industry) => {
            const selected = selectedIndustry === industry;

            return (
              <TouchableOpacity
                key={industry}
                style={[
                  styles.industryChip,
                  selected && styles.industryChipSelected,
                ]}
                onPress={() => setSelectedIndustry(industry)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.industryText,
                    selected && styles.industryTextSelected,
                  ]}
                >
                  {industry}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedIndustryError ? (
          <Text style={styles.textError}>{selectedIndustryError}</Text>
        ) : null}

        <TextInputMulLine
          label="JOB DESCRIPTION (OPTIONAL)"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChangeText={setJobDescription}
          style={{ height: 170 }}
        />
      </ScrollView>

      <Button
        style={{ marginBottom: 65 }}
        title="Next"
        onPress={handleTargetJobNext}
        loading={loading}
        icon="arrow-forward-outline"
        iconPosition="right"
      />

      </KeyboardAvoidingView>
    </View>
  );
};

export default TargetJobPosition;
