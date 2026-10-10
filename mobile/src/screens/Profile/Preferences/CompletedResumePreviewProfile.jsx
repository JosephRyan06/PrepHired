import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";

import { useRoute } from "@react-navigation/native";
import AppModal from "../../../components/AppModal";
import ResumeHeader from "../../../components/ResumeHeader";

import ResumeTemplate from "../../../template/ResumeTemplate";
import styles from "../../../styles/global";

import useResume from "../../../hooks/useResume";
import { resumePreviewHandler } from "../../../handlers/resume/resumePreviewHanlder";

const CompletedResumePreviewProfile = ({ navigation }) => {
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
        {/* Header */}
        <ResumeHeader
          navigation={navigation}
          resumeLabel="Completed Resume"
          navigateTo="MyResumes"
          resumeId={resumeId}
          rightIcon="download-outline"
          onRightPress={handleExportPDF}
          rightIconDisabled={loading}
        />

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
                height: 642,
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

export default CompletedResumePreviewProfile;
