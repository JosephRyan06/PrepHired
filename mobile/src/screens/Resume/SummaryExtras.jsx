import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { useRoute } from "@react-navigation/native";

import ResumeHeader from "../../components/ResumeHeader";
import TextInputMulLine from "../../components/TextInputMulLine";
import IconTextInput from "../../components/IconTextInput";
import Button from "../../components/Button";
import AppModal from "../../components/AppModal";
import LoadingModal from "../../components/LoadingModal";
import { Ionicons } from "@expo/vector-icons";

import styles from "../../styles/global";

import useResume from "../../hooks/useResume";
import { summaryExtrasHandler } from "../../handlers/resume/summaryExtrasHandler";

const SummaryExtras = ({ navigation }) => {
  const route = useRoute();

  const { resumeId } = route.params;

  const {
    getById,
    saveSummary,
    generateProfessionalSummary,
    optimizeResume,
    loading,
  } = useResume();

  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [generatingResume, setGeneratingResume] = useState(false);

  const [professionalSummary, setProfessionalSummary] = useState("");

  const [skills, setSkills] = useState("");

  const [certificates, setCertificates] = useState("");

  const [professionalSummaryError, setProfessionalSummaryError] = useState("");

  const [skillsError, setSkillsError] = useState("");

  const [certificatesError, setCertificatesError] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [projects, setProjects] = useState([
    {
      id: Date.now(),
      projectName: "",
      projectDescription: "",
      expanded: true,
    },
  ]);

  const [errors, setErrors] = useState({});

  const {
    loadSummaryExtrasResume,
    addProject,
    deleteProject,
    updateProject,
    toggleProject,
    handleGenerateSummary,
    handleSummaryExtrasNext,
  } = summaryExtrasHandler({
    resumeId,

    professionalSummary,
    skills,
    certificates,
    projects,

    setProfessionalSummary,
    setSkills,
    setCertificates,
    setProjects,

    setErrors,

    setProfessionalSummaryError,
    setSkillsError,
    setCertificatesError,

    setGeneratingSummary,
    setGeneratingResume,

    getById,
    saveSummary,
    generateProfessionalSummary,
    optimizeResume,

    setModalMessage,
    setModalVisible,
    navigation,
  });

  useEffect(() => {
    loadSummaryExtrasResume();
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
          resumeLabel="Summary & Extras"
          resumeId={resumeId}
          navigateTo="Education"
        />

        <Text
          style={{
            textAlign: "center",
            color: "#F8FAFC",
            fontWeight: "500",
            marginBottom: 10,
          }}
        >
          5/8
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
          <View
            style={[
              styles.percent,
              {
                width: "62.5%",
              },
            ]}
          />
        </View>

        <TextInputMulLine
          label="PROFESSIONAL SUMMARY"
          placeholder="Write a short professional summary..."
          value={professionalSummary}
          disabled={generatingSummary || generatingResume}
          onChangeText={(text) => {
            setProfessionalSummary(text);
            setProfessionalSummaryError("");
          }}
          style={{
            height: 170,
          }}
          error={professionalSummaryError}
        />

        <TouchableOpacity
          onPress={handleGenerateSummary}
          activeOpacity={0.7}
          style={{
            alignSelf: "flex-start",
            marginBottom: 10,
            opacity: loading ? 0.5 : 1,
          }}
          disabled={generatingSummary || generatingResume}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons name="sparkles-outline" size={16} color="#60A5FA" />

            <Text
              style={{
                color: "#60A5FA",
                textDecorationLine: "underline",
                fontWeight: "600",
                marginLeft: 5,
              }}
            >
              Generate with AI
            </Text>
          </View>
        </TouchableOpacity>

        {professionalSummaryError ? (
          <Text style={styles.textError}>{professionalSummaryError}</Text>
        ) : null}

        <IconTextInput
          label="SKILLS"
          style={{
            height: 55,
          }}
          icon="sparkles-outline"
          placeholder="e.g. Python, React Native"
          value={skills}
          onChangeText={(text) => {
            setSkills(text);
            setSkillsError("");
          }}
          error={skillsError}
          keyboardType="default"
        />

        {skillsError ? (
          <Text style={styles.textError}>{skillsError}</Text>
        ) : null}

        <IconTextInput
          label="CERTIFICATE/LICENSES (OPTIONAL)"
          style={{
            height: 55,
          }}
          icon="ribbon-outline"
          placeholder="e.g. LPT"
          value={certificates}
          onChangeText={(text) => {
            setCertificates(text);
            setCertificatesError("");
          }}
          keyboardType="default"
        />

        {certificatesError ? (
          <Text style={styles.textError}>{certificatesError}</Text>
        ) : null}

        <Text
          style={{
            color: "#F8FAFC",
            fontSize: 12,
            fontWeight: "600",
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          PROJECTS (OPTIONAL)
        </Text>

        {projects.map((project, index) => (
          <View
            key={project.id}
            style={[
              styles.projectContainer,
              {
                marginBottom: 15,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => toggleProject(project.id)}
              activeOpacity={0.8}
              style={{
                minHeight: 58,
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 6,
              }}
            >
              {/* NUMBER */}

              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: project.expanded ? "#2563EB" : "#30303A",
                  borderWidth: project.expanded ? 0 : 1,
                  borderColor: "#3F3F4A",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 13,
                }}
              >
                <Text
                  style={{
                    color: project.expanded ? "#FFFFFF" : "#A1A1AA",
                    fontSize: 14,
                    fontWeight: "800",
                  }}
                >
                  {index + 1}
                </Text>
              </View>

              {!project.expanded && (
                <Text
                  style={{
                    flex: 1,
                    color: project.projectName ? "#F8FAFC" : "#71717A",
                    fontSize: 15,
                    fontWeight: "700",
                    letterSpacing: 0.1,
                    marginRight: 10,
                  }}
                  numberOfLines={1}
                >
                  {project.projectName || "Untitled Project"}
                </Text>
              )}

              {project.expanded && (
                <View
                  style={{
                    flex: 1,
                  }}
                />
              )}

              {/* DELETE */}

              {project.expanded && projects.length > 1 && (
                <TouchableOpacity
                  onPress={() => deleteProject(project.id)}
                  activeOpacity={0.7}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 11,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#302A2D",
                    borderWidth: 1,
                    borderColor: "#453337",
                    marginRight: 7,
                  }}
                >
                  <Ionicons name="trash-outline" color="#F87171" size={19} />
                </TouchableOpacity>
              )}

              {/* CHEVRON */}

              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: project.expanded ? "#30303A" : "#2563EB",
                  borderWidth: project.expanded ? 1 : 0,
                  borderColor: "#3F3F4A",
                }}
              >
                <Ionicons
                  name={project.expanded ? "chevron-up" : "chevron-down"}
                  color={project.expanded ? "#D4D4D8" : "#FFFFFF"}
                  size={18}
                />
              </View>
            </TouchableOpacity>

            {project.expanded && (
              <>
                {/* PROJECT NAME */}

                <IconTextInput
                  label="PROJECT NAME"
                  style={{
                    height: 55,
                  }}
                  icon="folder-outline"
                  placeholder="e.g. E-Commerce Web Application"
                  value={project.projectName}
                  onChangeText={(text) =>
                    updateProject(project.id, "projectName", text)
                  }
                  keyboardType="default"
                />

                {errors[`${project.id}_projectName`] ? (
                  <Text
                    style={{
                      color: "red",
                      marginTop: 5,
                    }}
                  >
                    {errors[`${project.id}_projectName`]}
                  </Text>
                ) : null}

                {/* DESCRIPTION */}

                <TextInputMulLine
                  label="DESCRIPTION"
                  placeholder="Enter your project description..."
                  value={project.projectDescription}
                  onChangeText={(text) =>
                    updateProject(project.id, "projectDescription", text)
                  }
                  style={{
                    height: 120,
                  }}
                />

                {errors[`${project.id}_projectDescription`] ? (
                  <Text
                    style={{
                      color: "red",
                      marginTop: 5,
                    }}
                  >
                    {errors[`${project.id}_projectDescription`]}
                  </Text>
                ) : null}
              </>
            )}
          </View>
        ))}

        {projects.length < 5 && (
          <Button
            title="Add"
            icon="add-outline"
            onPress={addProject}
            style={{
              height: 45,
              marginTop: 5,
              backgroundColor: "#25252F",
              borderWidth: 1,
              borderColor: "#2563EB",
            }}
          />
        )}
      </ScrollView>

      <Button
        style={{
          marginBottom: 65,
        }}
        title="Generate Resume"
        onPress={handleSummaryExtrasNext}
        loading={generatingResume}
        disabled={generatingResume || generatingSummary}
      />

      </KeyboardAvoidingView>

      <AppModal
        visible={modalVisible}
        message={modalMessage}
        onClose={() => {
          setModalVisible(false);
          if (modalMessage.includes("Resume saved successfully.")) {
            navigation.replace("Resume");
          }
        }}
      />

      <LoadingModal
        visible={generatingSummary}
        title="Generating Summary"
        message="Please wait while AI creates your professional summary."
        icon="sparkles-outline"
      />

      <LoadingModal
        visible={generatingResume}
        title="Generating Resume"
        message="Please wait while we generate your resume."
        icon="document-text-outline"
      />
    </View>
  );
};

export default SummaryExtras;
