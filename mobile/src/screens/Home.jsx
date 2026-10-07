import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";

import styles from "../styles/global";

import getUserHandler from "../handlers/user/getUserHandler";
import useResume from "../hooks/useResume";
import useMockInterview from "../hooks/useMockInterview";

const Home = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  const [resumeData, setResumeData] = useState([]);
  const [interviewData, setInterviewData] = useState([]);

  const { getCompletedResumes } = useResume();
  const { getCompleted } = useMockInterview();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getUserHandler();
        setUser(userData);
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setDashboardLoading(true);

        const [resumeResult, interviewResult] = await Promise.all([
          getCompletedResumes(),
          getCompleted(),
        ]);

        setResumeData(resumeResult?.resumes || []);

        setInterviewData(
          interviewResult?.mockInterviews ||
            interviewResult?.interviews ||
            []
        );
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setDashboardLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // ==========================================
  // COMPLETED INTERVIEWS
  // ==========================================

  const completedInterviews = interviewData.filter(
    (interview) => interview?.status === "completed"
  );

  // ==========================================
  // LATEST RESUME
  // ==========================================

  const latestResume = resumeData?.[0];

  const atsScore = Number(latestResume?.aiAnalysis?.atsScore || 0);

  // ==========================================
  // INTERVIEW SCORE
  // ==========================================

  const interviewScores = completedInterviews
    .map((interview) => Number(interview?.overallScore || 0))
    .filter((score) => score > 0);

  const interviewAverage =
    interviewScores.length > 0
      ? Math.round(
          interviewScores.reduce((total, score) => total + score, 0) /
            interviewScores.length
        )
      : 0;

  // ==========================================
  // EMPLOYMENT READINESS
  // ==========================================

  let employmentReadiness = 0;

  if (atsScore > 0 && interviewAverage > 0) {
    employmentReadiness = Math.round(
      atsScore * 0.5 + interviewAverage * 0.5
    );
  } else if (atsScore > 0) {
    employmentReadiness = Math.round(atsScore * 0.5);
  } else if (interviewAverage > 0) {
    employmentReadiness = Math.round(interviewAverage * 0.5);
  }

  // ==========================================
  // READINESS MESSAGE
  // ==========================================

  const getReadinessMessage = () => {
    if (employmentReadiness >= 90) {
      return "You're highly prepared for a job.";
    }

    if (employmentReadiness >= 75) {
      return "You're well on your way to being job-ready.";
    }

    if (employmentReadiness >= 50) {
      return "Keep improving your resume and interview skills.";
    }

    if (employmentReadiness > 0) {
      return "Continue building your career readiness.";
    }

    return "Start building your resume and practicing interviews.";
  };

  // ==========================================
  // RECENT ACTIVITY
  // ==========================================

  const recentActivities = [];

  if (latestResume) {
    recentActivities.push({
      id: `resume-${latestResume._id || latestResume.id}`,
      icon: "document-text-outline",
      title: "Resume completed",
      subtitle: latestResume?.targetJob?.jobTitle
        ? `Target role: ${latestResume.targetJob.jobTitle}`
        : "Your resume is ready",
      score:
        atsScore > 0 ? `ATS Score: ${atsScore}%` : "Resume completed",
    });
  }

  if (completedInterviews.length > 0) {
    const latestInterview = completedInterviews[0];

    recentActivities.push({
      id: `interview-${latestInterview._id || latestInterview.id}`,
      icon: "mic-outline",
      title: "Mock interview completed",
      subtitle: latestInterview?.targetJob
        ? `Target role: ${latestInterview.targetJob}`
        : "Interview practice completed",
      score:
        latestInterview?.overallScore != null
          ? `Score: ${latestInterview.overallScore}%`
          : "Completed",
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ==========================================
            HEADER
        ========================================== */}

        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Good day,</Text>

            <Text style={styles.userName}>
              {user?.fullName || "User"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <View style={styles.profileCircle}>
              <Ionicons
                name="person"
                size={28}
                color="#F8FAFC"
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* ==========================================
            EMPLOYMENT READINESS
        ========================================== */}

        <View style={styles.employmentReadinessCard}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                color: "#71717A",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              EMPLOYMENT READINESS
            </Text>

            {!dashboardLoading && (
              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: 20,
                  fontWeight: "800",
                }}
              >
                {employmentReadiness}%
              </Text>
            )}
          </View>

          <View style={styles.line}>
            <View
              style={[
                styles.percent,
                {
                  width: `${employmentReadiness}%`,
                },
              ]}
            />
          </View>

          {dashboardLoading ? (
            <View
              style={{
                marginTop: 12,
                alignItems: "flex-start",
              }}
            >
              <ActivityIndicator
                size="small"
                color="#F8FAFC"
              />
            </View>
          ) : (
            <Text
              style={{
                color: "#71717A",
                fontSize: 13,
                marginTop: 10,
              }}
            >
              {getReadinessMessage()}
            </Text>
          )}
        </View>

        {/* ==========================================
            QUICK ACTIONS
        ========================================== */}

        <Text
          style={{
            color: "#F8FAFC",
            fontSize: 18,
            fontWeight: "700",
            marginTop: 10,
          }}
        >
          Quick Actions
        </Text>

        <View style={styles.quickActionsCard}>
          <TouchableOpacity
            style={styles.cardAction}
            onPress={() => navigation.navigate("Resume")}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="create-outline"
                color="#F8FAFC"
                size={24}
              />
            </View>

            <Text style={styles.cardActionText}>
              Build Resume
            </Text>

            <Text style={styles.cardActionSubtext}>
              Create your resume
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cardAction, styles.primaryCard]}
            onPress={() => navigation.navigate("Interview")}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.iconContainer,
                styles.primaryIcon,
              ]}
            >
              <Ionicons
                name="mic-outline"
                color="#F8FAFC"
                size={24}
              />
            </View>

            <Text style={styles.cardActionText}>
              Mock Interview
            </Text>

            <Text style={styles.cardActionSubtext}>
              Practice your skills
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickActionsCard}>
          <TouchableOpacity
            style={[styles.cardAction, styles.primaryCard]}
            onPress={() => navigation.navigate("MyResumes")}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.iconContainer,
                styles.primaryIcon,
              ]}
            >
              <Ionicons
                name="document-text-outline"
                color="#F8FAFC"
                size={24}
              />
            </View>

            <Text style={styles.cardActionText}>
              My Resumes
            </Text>

            <Text style={styles.cardActionSubtext}>
              View your saved resumes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cardAction}
            onPress={() =>
              navigation.navigate("InterviewHistory")
            }
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="time-outline"
                color="#F8FAFC"
                size={24}
              />
            </View>

            <Text style={styles.cardActionText}>
              Interview History
            </Text>

            <Text style={styles.cardActionSubtext}>
              See past interviews
            </Text>
          </TouchableOpacity>
        </View>

        {/* ==========================================
            RECENT ACTIVITY
        ========================================== */}

        <Text
          style={{
            color: "#F8FAFC",
            fontSize: 18,
            fontWeight: "700",
            marginTop: 10,
          }}
        >
          Recent Activity
        </Text>

        <View style={homeStyles.activityContainer}>
          {dashboardLoading ? (
            <View style={homeStyles.emptyActivity}>
              <ActivityIndicator
                size="small"
                color="#F8FAFC"
              />

              <Text style={homeStyles.emptyActivityText}>
                Loading activity...
              </Text>
            </View>
          ) : recentActivities.length === 0 ? (
            <View style={homeStyles.emptyActivity}>
              <View style={homeStyles.emptyIcon}>
                <Ionicons
                  name="time-outline"
                  size={24}
                  color="#71717A"
                />
              </View>

              <Text style={homeStyles.emptyActivityTitle}>
                No recent activity
              </Text>

              <Text style={homeStyles.emptyActivityText}>
                Complete a resume or mock interview to see
                your activity here.
              </Text>
            </View>
          ) : (
            recentActivities.slice(0, 3).map((activity) => (
              <View
                key={activity.id}
                style={homeStyles.activityItem}
              >
                <View style={homeStyles.activityIcon}>
                  <Ionicons
                    name={activity.icon}
                    size={22}
                    color="#F8FAFC"
                  />
                </View>

                <View style={homeStyles.activityContent}>
                  <Text
                    style={homeStyles.activityTitle}
                  >
                    {activity.title}
                  </Text>

                  <Text
                    style={homeStyles.activitySubtitle}
                  >
                    {activity.subtitle}
                  </Text>
                </View>

                <Text style={homeStyles.activityScore}>
                  {activity.score}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <BottomNav active="home" />
    </View>
  );
};

const homeStyles = StyleSheet.create({
  activityContainer: {
    backgroundColor: "#25252F",
    borderRadius: 14,
    marginTop: 10,
    marginBottom: 20,
    overflow: "hidden",
  },

  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#353541",
  },

  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  activityContent: {
    flex: 1,
  },

  activityTitle: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "700",
  },

  activitySubtitle: {
    color: "#71717A",
    fontSize: 12,
    marginTop: 4,
  },

  activityScore: {
    color: "#F8FAFC",
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 8,
  },

  emptyActivity: {
    padding: 25,
    alignItems: "center",
  },

  emptyIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1F1F27",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  emptyActivityTitle: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 5,
  },

  emptyActivityText: {
    color: "#71717A",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});

export default Home;