import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
} from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";
import ResumeHeader from "../../../components/ResumeHeader";
import ResumeTemplate from "../../../template/ResumeTemplate";
import styles from "../../../styles/global";

import useResume from "../../../hooks/useResume";

const MyResumes = () => {
  const navigation = useNavigation();

  const { getCompletedResumes, loading } = useResume();
  
  const [resumes, setResumes] = useState([]);

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

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <ResumeHeader
          navigation={navigation}
          resumeLabel="My Resumes"
          navigateTo="Profile"
        />

         <View style={styles.myResumeCardContainer}>
          {loading ? (
            // LOADING SKELETON
            <>
              {[1, 2, 3, 4, 5, 6 ,7 ,8].map((item) => (
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
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 50,
                }}
              >
                <Ionicons
                  name="document-text-outline"
                  size={42}
                  color="#71717A"
                />
    
                <Text
                  style={{
                    color: "#F8FAFC",
                    fontSize: 14,
                    fontWeight: "700",
                    marginTop: 12,
                    textAlign: "center",
                  }}
                >
                  No resume created yet
                </Text>
    
                <Text
                  style={{
                    color: "#71717A",
                    fontSize: 12,
                    marginTop: 6,
                    textAlign: "center",
                  }}
                >
                  Complete a mock interview to see it
                  here.
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
                  navigation.navigate("CompletedResumePreviewProfile", {
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

    </View>
  );
};

export default MyResumes;
