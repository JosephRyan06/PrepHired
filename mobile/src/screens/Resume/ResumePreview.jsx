import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";

import { useRoute } from "@react-navigation/native";
import AppModal from "../../components/AppModal";
import ResumeHeader from "../../components/ResumeHeader";
import Button from "../../components/Button";
import ResumeTemplate from "../../template/ResumeTemplate";
import styles from "../../styles/global";

import useResume from "../../hooks/useResume";
import { resumePreviewHandler } from "../../handlers/resume/resumePreviewHanlder";

const ResumePreview = ({ navigation }) => {
  const route = useRoute();
  const { resumeId } = route.params;

  const { getById, complete, exportPDF, loading } = useResume();

  const [resume, setResume] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const { loadResume, handleSaveResume, handleExportPDF } =
    resumePreviewHandler({
      resumeId,
      setResume,
      setModalVisible,
      setModalMessage,
      getById,
      complete,
      exportPDF,
      navigation,
      loading,
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
          resumeLabel="Resume Preview"
          navigateTo="ChooseTemplate"
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
          8/8
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
                width: "100%",
              },
            ]}
          />
        </View>

        {/* Resume Preview */}
        <View
          style={{
            width: "100%",
            backgroundColor: "#FFFFFF",
            borderRadius: 8,
            marginBottom: 20,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {resume && (
            <View
              style={{
                width: 595,
                height: 842,
                overflow: "hidden",
                backgroundColor: "#FFFFFF",
              }}
            >
              <ResumeTemplate
                resume={resume}
                template={resume.template}
                preview={true}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Button
          style={{
            marginBottom: 65,
            width: "48%",
            backgroundColor: "#15151B",
            borderWidth: 2,
            borderColor: "#2563EB",
          }}
          title="Export PDF"
          onPress={handleExportPDF}
          disabled={loading}
        />

        <Button
          style={{
            marginBottom: 15,
            width: "48%",
          }}
          title="Save Resume"
          onPress={handleSaveResume}
          disabled={loading}
        />
      </View>

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
    </View>
  );
};

export default ResumePreview;
