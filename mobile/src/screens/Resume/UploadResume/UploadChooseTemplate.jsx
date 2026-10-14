import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { useRoute } from "@react-navigation/native";
import ResumeHeader from "../../../components/ResumeHeader";
import Button from "../../../components/Button";
import ResumeTemplate from "../../../template/ResumeTemplate";

import { Ionicons } from "@expo/vector-icons";
import styles from "../../../styles/global";

import useResume from "../../../hooks/useResume";
import { chooseTemplateHandler } from "../../../handlers/resume/uploadResume/chooseTemplateHandler";

const UploadChooseTemplate = ({ navigation }) => {
  const route = useRoute();
  const { resumeId } = route.params;

  const { getById, saveTemplate, loading } = useResume();

  const [resume, setResume] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [error, setError] = useState("");

  const templates = [
    {
      id: "classic",
      name: "Classic",
      description: "Clean and traditional resume layout.",
      icon: "document-text-outline",
    },
    {
      id: "modern",
      name: "Modern",
      description: "A modern and professional resume design.",
      icon: "sparkles-outline",
    },
    {
      id: "professional",
      name: "Professional",
      description: "Professional layout suitable for corporate jobs.",
      icon: "briefcase-outline",
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Simple and clean design with less visual clutter.",
      icon: "remove-outline",
    },
  ];

  const { loadResume, handleSelectTemplate, handleContinue } =
    chooseTemplateHandler({
      resumeId,
      getById,
      selectedTemplate,
      setResume,
      setSelectedTemplate,
      setError,
      saveTemplate,
      navigation,
    });

  useEffect(() => {
    loadResume();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ResumeHeader
          navigation={navigation}
          resumeLabel="Choose Template"
          navigateTo="UploadedAiGeneratedResume"
          resumeId={resumeId}
        />

        <Text
          style={{
            textAlign: "center",
            color: "#F8FAFC",
            fontWeight: "500",
            marginBottom: 10,
          }}
        >
          2/3
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
                width: "66.6%",
              },
            ]}
          />
        </View>

        <Text
          style={{
            color: "#F8FAFC",
            fontSize: 22,
            fontWeight: "700",
            marginBottom: 8,
          }}
        >
          Choose Your Template
        </Text>

        <Text
          style={{
            color: "#71717A",
            fontSize: 14,
            marginBottom: 20,
            lineHeight: 20,
          }}
        >
          Select a template that best matches your professional style.
        </Text>

        {error ? (
          <Text
            style={{
              color: "#EF4444",
              fontSize: 13,
              marginBottom: 15,
            }}
          >
            {error}
          </Text>
        ) : null}

        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id;

          return (
            <TouchableOpacity
              key={template.id}
              activeOpacity={0.8}
              onPress={() => handleSelectTemplate(template.id)}
              style={{
                backgroundColor: "#25252F",
                borderWidth: 1.5,
                borderColor: isSelected ? "#2563EB" : "transparent",
                borderRadius: 12,
                padding: 15,
                marginBottom: 15,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    backgroundColor: isSelected ? "#2563EB" : "#15151B",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  <Ionicons name={template.icon} size={22} color="#F8FAFC" />
                </View>

                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      color: "#F8FAFC",
                      fontSize: 16,
                      fontWeight: "600",
                      marginBottom: 4,
                    }}
                  >
                    {template.name}
                  </Text>

                  <Text
                    style={{
                      color: "#71717A",
                      fontSize: 13,
                      lineHeight: 18,
                    }}
                  >
                    {template.description}
                  </Text>
                </View>

                <Ionicons
                  name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                  size={24}
                  color={isSelected ? "#2563EB" : "#71717A"}
                />
              </View>

              {/* Template Preview */}
              {resume ? (
                <View
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 8,
                    overflow: "hidden",
                    maxHeight: 280,
                  }}
                >
                  <ResumeTemplate
                    resume={{
                      ...resume,
                      template: template.id,
                    }}
                    template={template.id}
                  />
                </View>
              ) : (
                <View
                  style={{
                    height: 150,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator size="small" color="#2563EB" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Button
        style={{
          marginBottom: 65,
        }}
        title="Continue"
        onPress={handleContinue}
        disabled={loading}
      />
    </View>
  );
};

export default UploadChooseTemplate;
