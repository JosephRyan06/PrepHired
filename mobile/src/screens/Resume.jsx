import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";

import LoadingModal from "../components/LoadingModal";
import Button from "../components/Button";
import AppModal from "../components/AppModal";
import BottomNav from "../components/BottomNav";
import ResumeTemplate from "../template/ResumeTemplate";

import styles from "../styles/global";

import useResume from "../hooks/useResume";
import { uploadResumeHandler } from "../handlers/resume/uploadResumeHandler";

const Resume = () => {
  const navigation = useNavigation();
  
  const { getCompletedResumes, importResumeFile, loading } = useResume();
  const [uploadingResume, setUploadingResume] = useState(false);
  const [ modalVisible, setModalVisible ] = useState(false);
  const [ modalMessage, setMessage ] = useState("");
  const [resumes, setResumes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadCompletedResumes();
    }, []),
  );

  const loadCompletedResumes = async () => {
    const result = await getCompletedResumes();

    if (result.success) {
      setResumes(result.resumes);
    } else {
      console.log("Get completed resumes error:", result.message);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await loadCompletedResumes();
    } finally {
      setRefreshing(false);
    }
  };

  const { handleUploadResume } = uploadResumeHandler({
    setUploadingResume,
    importResumeFile,
    setModalVisible,
    setMessage,
    navigation,
  });


  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#F8FAFC"
            colors={["#F8FAFC"]}
            progressBackgroundColor="#25252F"
          />
        }
      >
      
        <Text
          style={{
            color: "#F8FAFC",
            fontWeight: "800",
            fontSize: 24,
          }}
        >
          Resume Builder
        </Text>

        <Text
          style={{
            color: "#71717A",
            fontSize: 13,
            marginTop: 5,
            marginBottom: 18,
          }}
        >
          Let's build your resume.
        </Text>

        <View style={styles.uploadResumeCard}>
          <TouchableOpacity onPress={handleUploadResume}>
            <View style={styles.uploadIconContainer}>
              <Ionicons name="cloud-upload-outline" size={40} color="#F8FAFC" />
            </View>
          </TouchableOpacity>

          <Text
            style={{
              marginTop: 14,
              color: "#F8FAFC",
              fontWeight: "600",
              fontSize: 15,
            }}
          >
            Upload Existing Resume
          </Text>
          <Text
            style={{
              marginTop: 12,
              color: "#71717A",
              fontWeight: "400",
              fontSize: 14,
            }}
          >
            Tap to upload
          </Text>
        </View>

        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "#D1D5DB",
              marginLeft: 10,
              marginRight: 10,
            }}
          />
          <Text
            style={{
              marginHorizontal: 12,
              color: "#6B7280",
              fontSize: 14,
              fontWeight: "500",
            }}
          >
            OR
          </Text>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "#D1D5DB",
              marginLeft: 10,
              marginRight: 10,
            }}
          />
        </View>

        <Button
          style={{ marginTop: 15 }}
          title="Start from Scratch"
          onPress={() => navigation.navigate("BasicInfo")}
        />

        <Text
          style={{
            marginTop: 20,
            color: "#F8FAFC",
            fontWeight: "700",
            fontSize: 15,
          }}
        >
          My Resumes
        </Text>

        <View style={styles.myResumeCardContainer}>
          {loading ? (
            // LOADING SKELETON
            <>
              {[1, 2].map((item) => (
                <View
                  key={item}
                  style={[
                    styles.resumeCard,
                    {
                      width: "48%",
                      backgroundColor: "#25252F",
                    },
                  ]}
                >
                  <View style={styles.skeletonHeader} />

                  <View style={styles.skeletonLineLarge} />
                  <View style={styles.skeletonLine} />
                  <View style={styles.skeletonLine} />

                  <View style={styles.skeletonBody}>
                    <View style={styles.skeletonLine} />
                    <View style={styles.skeletonLine} />
                    <View style={styles.skeletonLine} />
                  </View>
                </View>
              ))}
            </>
          ) : resumes.length === 0 ? (
            // NO RESUMES paddingVertical: 70
            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 30,
              }}
            >
              <Ionicons
                name="document-text-outline"
                size={30}
                color="#A1A1AA"
              />
              <Text
                style={{
                  color: "#A1A1AA",
                  fontSize: 14,
                  fontWeight: "600",
                  marginTop: 5,
                }}
              >
                No resumes created yet
              </Text>
            </View>
          ) : (
            // RESUMES
            resumes.map((resume) => (
              <TouchableOpacity
                key={resume._id}
                style={[
                  styles.resumeCard,
                  {
                    width: "48%",
                  },
                ]}
                activeOpacity={0.8}
                
                onPress={() =>
                  navigation.navigate("CompletedResumePreview", {
                    resumeId: resume._id,
                  })
                }
                
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <ResumeTemplate resume={resume} template={resume.template} />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <BottomNav active="resume" />

      <AppModal
        visible={modalVisible}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />

      <LoadingModal
        visible={uploadingResume}
        title="Processing Your Resume"
        message="Please wait while we process your resume."
        icon="sparkles-outline"
      />
    </View>
  );
};

export default Resume;