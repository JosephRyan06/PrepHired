
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

import Button from "../../components/Button";
import ResumeHeader from "../../components/ResumeHeader";
import styles from "../../styles/global";

const RESUME_STEPS = [
  {
    id: 1,
    title: "Basic Information",
    description: "Add your personal and contact details.",
    icon: "person-outline",
    screen: "BasicInfo",
  },
  {
    id: 2,
    title: "Target Job",
    description: "Choose your desired position and industry.",
    icon: "briefcase-outline",
    screen: "TargetJob",
  },
  {
    id: 3,
    title: "Work Experience",
    description: "Add your employment history and experience.",
    icon: "business-outline",
    screen: "WorkExperience",
  },
  {
    id: 4,
    title: "Education",
    description: "Include your educational background.",
    icon: "school-outline",
    screen: "Education",
  },
  {
    id: 5,
    title: "Summary & Extras",
    description: "Add your summary, skills, projects, and certificates.",
    icon: "document-text-outline",
    screen: "SummaryExtras",
  },
  {
    id: 6,
    title: "AI-Optimized Resume",
    description: "Review AI improvements and your ATS analysis.",
    icon: "sparkles-outline",
    screen: "AiGeneratedResume",
  },
  {
    id: 7,
    title: "Choose Template",
    description: "Select a professional resume design.",
    icon: "color-palette-outline",
    screen: "ChooseTemplate",
  },
  {
    id: 8,
    title: "Resume Preview",
    description: "Preview, export, and save your finished resume.",
    icon: "eye-outline",
    screen: "ResumePreview",
  },
];

const ResumeTimeline = ({ navigation }) => {
  const route = useRoute();
  
  const resumeId = route.params?.resumeId;
  const currentStep = Math.min(
    8,
    Math.max(1, Number(route.params?.currentStep) || 1)
  );


  const handleStepPress = (step) => {
    if (!resumeId) return;

    navigation.navigate(step.screen, {
      resumeId,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        <ResumeHeader
          navigation={navigation}
          resumeLabel="Resume Timeline"
          navigateTo="Resume"
        />

        <View>

          {/* Timeline Heading */}
          <View style={{ marginBottom: 22 }}>
            <Text
              style={{
                color: "#F8FAFC",
                fontSize: 19,
                fontWeight: "800",
                marginBottom: 6,
              }}
            >
              Build Your Resume
            </Text>

            <Text
              style={{
                color: "#71717A",
                fontSize: 13,
                lineHeight: 20,
              }}
            >
              Follow each step to create your professional,
              ATS-friendly resume.
            </Text>
          </View>

          {/* Vertical Timeline */}
          {RESUME_STEPS.map((step, index) => {
            const isLast = index === RESUME_STEPS.length - 1;

            return (
              <View
                key={step.id}
                style={{
                  flexDirection: "row",
                  minHeight: 112,
                }}
              >
                {/* Timeline Icon and Connecting Line */}
                <View
                  style={{
                    width: 48,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 14,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#25252F",
                      borderWidth: 1,
                      borderColor: "#30303B",
                    }}
                  >
                    <Ionicons
                      name={step.icon}
                      size={21}
                      color="#60A5FA"
                    />
                  </View>

                  {!isLast && (
                    <View
                      style={{
                        width: 2,
                        flex: 1,
                        minHeight: 55,
                        marginTop: 5,
                        marginBottom: 5,
                        backgroundColor: "#30303B",
                      }}
                    />
                  )}
                </View>

                {/* Timeline Card */}
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => handleStepPress(step)}
                  disabled={!resumeId}
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    marginBottom: 16,
                    padding: 15,
                    borderRadius: 14,
                    backgroundColor: "#25252F",
                    borderWidth: 1,
                    borderColor: "#30303B",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 7,
                    }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        color: "#F8FAFC",
                        fontSize: 14,
                        fontWeight: "700",
                        paddingRight: 8,
                      }}
                    >
                      {step.id}. {step.title}
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: "#A1A1AA",
                      fontSize: 12,
                      lineHeight: 18,
                    }}
                  >
                    {step.description}
                  </Text>

                </TouchableOpacity>
              </View>
            );
          })}

          {/* Resume Preview Shortcut */}
          {currentStep === 8 && resumeId && (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate("ResumePreview", {
                  resumeId,
                })
              }
              style={{
                height: 50,
                borderRadius: 12,
                backgroundColor: "#2563EB",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                marginTop: 20,
              }}
            >
              <Ionicons
                name="eye-outline"
                size={19}
                color="#FFFFFF"
                style={{ marginRight: 9 }}
              />

              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: "700",
                }}
              >
                Open Resume Preview
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <Button
        style={{ marginBottom: 65 }}
        title="Next"
        icon="arrow-forward-outline"
        iconPosition="right"
        onPress={() => navigation.navigate("BasicInfo")}
      /> 

    </View>
  );
};

export default ResumeTimeline;
