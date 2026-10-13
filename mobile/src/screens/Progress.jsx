import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import BottomNav from "../components/BottomNav";
import styles from "../styles/global";

import useProgress from "../hooks/useProgress";

const Progress = () => {
  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);

  const {
    progress,
    loading,
    refetch: refetchProgress,
  } = useProgress();

  const isLoading = loading || refreshing;

  const onRefresh = async () => {
    if (refreshing) return;

    setRefreshing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (typeof refetchProgress === "function") {
        await refetchProgress();
      }
    } catch (error) {
      console.error("Failed to refresh progress:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const employmentReadiness = progress?.employmentReadiness || 0;

  const resumeAtsScore = progress?.resume?.atsScore || 0;

  const resumeCount = progress?.resume?.completed || 0;

  const interviewAverage = progress?.interviews?.averageScore || 0;

  const completedInterviews = progress?.interviews?.completed || 0;

  const skills = progress?.skills || {};

  const getScoreColor = (score) => {
    if (score >= 80) {
      return "#22C55E";
    }

    if (score >= 60) {
      return "#F59E0B";
    }

    return "#EF4444";
  };

  const getReadinessLabel = (score) => {
    if (score >= 90) {
      return "Excellent";
    }

    if (score >= 75) {
      return "Good";
    }

    if (score >= 50) {
      return "Developing";
    }

    if (score > 0) {
      return "Needs Improvement";
    }

    return "Not Started";
  };

  const skillData = [
    {
      label: "Communication",
      value: skills.communication || 0,
      icon: "chatbubble-outline",
    },
    {
      label: "Technical Knowledge",
      value: skills.technicalKnowledge || 0,
      icon: "code-slash-outline",
    },
    {
      label: "Problem Solving",
      value: skills.problemSolving || 0,
      icon: "bulb-outline",
    },
    {
      label: "Confidence",
      value: skills.confidence || 0,
      icon: "trending-up-outline",
    },
    {
      label: "Relevance",
      value: skills.relevance || 0,
      icon: "checkmark-circle-outline",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: 110,
          },
        ]}
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
        {/* HEADER */}

        <Text
          style={{
            color: "#F8FAFC",
            fontWeight: "800",
            fontSize: 24,
          }}
        >
          Progress Dashboard
        </Text>

        <Text
          style={{
            color: "#71717A",
            fontSize: 13,
            marginTop: 5,
            marginBottom: 18,
          }}
        >
          Track your employment readiness
        </Text>

        {/* EMPLOYMENT READINESS */}

        <View
          style={{
            backgroundColor: "#25252F",
            borderRadius: 18,
            padding: 20,
          }}
        >
          <Text
            style={{
              color: "#71717A",
              fontSize: 13,
              fontWeight: "700",
            }}
          >
            EMPLOYMENT READINESS
          </Text>

          {isLoading ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 18,
                }}
              >
                <View
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 45,
                    backgroundColor: "#3F3F46",
                  }}
                />

                <View
                  style={{
                    flex: 1,
                    marginLeft: 18,
                  }}
                >
                  <View
                    style={{
                      width: "55%",
                      height: 18,
                      backgroundColor: "#3F3F46",
                      borderRadius: 6,
                    }}
                  />

                  <View
                    style={{
                      width: "90%",
                      height: 12,
                      backgroundColor: "#3F3F46",
                      borderRadius: 6,
                      marginTop: 9,
                    }}
                  />

                  <View
                    style={{
                      width: "75%",
                      height: 12,
                      backgroundColor: "#3F3F46",
                      borderRadius: 6,
                      marginTop: 6,
                    }}
                  />
                </View>
              </View>

              <View
                style={{
                  height: 8,
                  backgroundColor: "#3F3F46",
                  borderRadius: 10,
                  marginTop: 20,
                }}
              />
            </>
          ) : (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 18,
                }}
              >
                <View
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 45,
                    borderWidth: 8,
                    borderColor: getScoreColor(employmentReadiness),
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#F8FAFC",
                      fontSize: 24,
                      fontWeight: "800",
                    }}
                  >
                    {employmentReadiness}
                  </Text>

                  <Text
                    style={{
                      color: "#71717A",
                      fontSize: 10,
                    }}
                  >
                    / 100
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    marginLeft: 18,
                  }}
                >
                  <Text
                    style={{
                      color: getScoreColor(employmentReadiness),
                      fontSize: 18,
                      fontWeight: "800",
                    }}
                  >
                    {getReadinessLabel(employmentReadiness)}
                  </Text>

                  <Text
                    style={{
                      color: "#A1A1AA",
                      fontSize: 12,
                      lineHeight: 18,
                      marginTop: 5,
                    }}
                  >
                    Based on your resume and mock interview performance.
                  </Text>
                </View>
              </View>

              <View
                style={{
                  height: 8,
                  backgroundColor: "#3F3F46",
                  borderRadius: 10,
                  overflow: "hidden",
                  marginTop: 20,
                }}
              >
                <View
                  style={{
                    width: `${employmentReadiness}%`,
                    height: "100%",
                    backgroundColor: getScoreColor(employmentReadiness),
                    borderRadius: 10,
                  }}
                />
              </View>
            </>
          )}
        </View>

        {/* RESUME */}

        <Text
          style={{
            color: "#F8FAFC",
            fontSize: 18,
            fontWeight: "700",
            marginTop: 22,
            marginBottom: 10,
          }}
        >
          Resume
        </Text>

        <View
          style={{
            backgroundColor: "#25252F",
            borderRadius: 16,
            padding: 18,
          }}
        >
          {isLoading ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: "#3F3F46",
                  }}
                />

                <View
                  style={{
                    flex: 1,
                    marginLeft: 12,
                  }}
                >
                  <View
                    style={{
                      width: "60%",
                      height: 15,
                      backgroundColor: "#3F3F46",
                      borderRadius: 6,
                    }}
                  />

                  <View
                    style={{
                      width: "45%",
                      height: 11,
                      backgroundColor: "#3F3F46",
                      borderRadius: 6,
                      marginTop: 7,
                    }}
                  />
                </View>

                <View
                  style={{
                    width: 35,
                    height: 20,
                    backgroundColor: "#3F3F46",
                    borderRadius: 6,
                  }}
                />
              </View>

              <View
                style={{
                  height: 7,
                  backgroundColor: "#3F3F46",
                  borderRadius: 10,
                  marginTop: 18,
                }}
              />

              <View
                style={{
                  width: 70,
                  height: 11,
                  backgroundColor: "#3F3F46",
                  borderRadius: 6,
                  marginTop: 8,
                }}
              />

              <View
                style={{
                  height: 42,
                  backgroundColor: "#3F3F46",
                  borderRadius: 10,
                  marginTop: 15,
                }}
              />
            </>
          ) : (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: "#1D4ED8",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={22}
                    color="#F8FAFC"
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                    marginLeft: 12,
                  }}
                >
                  <Text
                    style={{
                      color: "#F8FAFC",
                      fontSize: 15,
                      fontWeight: "700",
                    }}
                  >
                    Resume Quality
                  </Text>

                  <Text
                    style={{
                      color: "#71717A",
                      fontSize: 12,
                      marginTop: 3,
                    }}
                  >
                    {resumeCount} completed resume
                    {resumeCount === 1 ? "" : "s"}
                  </Text>
                </View>

                <Text
                  style={{
                    color: getScoreColor(resumeAtsScore),
                    fontSize: 20,
                    fontWeight: "800",
                  }}
                >
                  {resumeAtsScore}
                </Text>
              </View>

              <View
                style={{
                  height: 7,
                  backgroundColor: "#3F3F46",
                  borderRadius: 10,
                  overflow: "hidden",
                  marginTop: 18,
                }}
              >
                <View
                  style={{
                    width: `${resumeAtsScore}%`,
                    height: "100%",
                    backgroundColor: getScoreColor(resumeAtsScore),
                  }}
                />
              </View>

              <Text
                style={{
                  color: "#71717A",
                  fontSize: 11,
                  marginTop: 8,
                }}
              >
                ATS SCORE
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate("MyResumes")}
                style={{
                  backgroundColor: "#1D4ED8",
                  paddingVertical: 12,
                  borderRadius: 10,
                  alignItems: "center",
                  marginTop: 15,
                }}
              >
                <Text
                  style={{
                    color: "#F8FAFC",
                    fontSize: 13,
                    fontWeight: "700",
                  }}
                >
                  View My Resumes
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* MOCK INTERVIEWS */}

        <Text
          style={{
            color: "#F8FAFC",
            fontSize: 18,
            fontWeight: "700",
            marginTop: 22,
            marginBottom: 10,
          }}
        >
          Mock Interviews
        </Text>

        <View
          style={{
            backgroundColor: "#25252F",
            borderRadius: 16,
            padding: 18,
          }}
        >
          {isLoading ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: "#3F3F46",
                  }}
                />

                <View
                  style={{
                    flex: 1,
                    marginLeft: 12,
                  }}
                >
                  <View
                    style={{
                      width: "65%",
                      height: 15,
                      backgroundColor: "#3F3F46",
                      borderRadius: 6,
                    }}
                  />

                  <View
                    style={{
                      width: "40%",
                      height: 11,
                      backgroundColor: "#3F3F46",
                      borderRadius: 6,
                      marginTop: 7,
                    }}
                  />
                </View>

                <View
                  style={{
                    width: 35,
                    height: 20,
                    backgroundColor: "#3F3F46",
                    borderRadius: 6,
                  }}
                />
              </View>

              <View
                style={{
                  height: 7,
                  backgroundColor: "#3F3F46",
                  borderRadius: 10,
                  marginTop: 18,
                }}
              />

              <View
                style={{
                  height: 42,
                  backgroundColor: "#3F3F46",
                  borderRadius: 10,
                  marginTop: 15,
                }}
              />
            </>
          ) : (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: "#7C3AED",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="mic-outline" size={22} color="#F8FAFC" />
                </View>

                <View
                  style={{
                    flex: 1,
                    marginLeft: 12,
                  }}
                >
                  <Text
                    style={{
                      color: "#F8FAFC",
                      fontSize: 15,
                      fontWeight: "700",
                    }}
                  >
                    Interview Performance
                  </Text>

                  <Text
                    style={{
                      color: "#71717A",
                      fontSize: 12,
                      marginTop: 3,
                    }}
                  >
                    {completedInterviews} completed
                  </Text>
                </View>

                <Text
                  style={{
                    color: getScoreColor(interviewAverage),
                    fontSize: 20,
                    fontWeight: "800",
                  }}
                >
                  {interviewAverage}
                </Text>
              </View>

              <View
                style={{
                  height: 7,
                  backgroundColor: "#3F3F46",
                  borderRadius: 10,
                  overflow: "hidden",
                  marginTop: 18,
                }}
              >
                <View
                  style={{
                    width: `${interviewAverage}%`,
                    height: "100%",
                    backgroundColor: getScoreColor(interviewAverage),
                  }}
                />
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate("InterviewHistory")}
                style={{
                  backgroundColor: "#3F3F46",
                  paddingVertical: 12,
                  borderRadius: 10,
                  alignItems: "center",
                  marginTop: 15,
                }}
              >
                <Text
                  style={{
                    color: "#F8FAFC",
                    fontSize: 13,
                    fontWeight: "700",
                  }}
                >
                  View Interview History
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* INTERVIEW SKILLS */}

        <Text
          style={{
            color: "#F8FAFC",
            fontSize: 18,
            fontWeight: "700",
            marginTop: 22,
            marginBottom: 10,
          }}
        >
          Interview Skills
        </Text>

        {isLoading
          ? [1, 2, 3, 4, 5].map((item) => (
              <View
                key={item}
                style={{
                  backgroundColor: "#25252F",
                  borderRadius: 14,
                  padding: 15,
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 5,
                      backgroundColor: "#3F3F46",
                    }}
                  />

                  <View
                    style={{
                      flex: 1,
                      height: 13,
                      backgroundColor: "#3F3F46",
                      borderRadius: 6,
                      marginLeft: 10,
                    }}
                  />

                  <View
                    style={{
                      width: 35,
                      height: 14,
                      backgroundColor: "#3F3F46",
                      borderRadius: 6,
                    }}
                  />
                </View>

                <View
                  style={{
                    height: 6,
                    backgroundColor: "#3F3F46",
                    borderRadius: 10,
                    marginTop: 12,
                  }}
                />
              </View>
            ))
          : skillData.map((skill) => (
              <View
                key={skill.label}
                style={{
                  backgroundColor: "#25252F",
                  borderRadius: 14,
                  padding: 15,
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name={skill.icon} size={20} color="#A1A1AA" />

                  <Text
                    style={{
                      flex: 1,
                      color: "#F8FAFC",
                      fontSize: 13,
                      fontWeight: "600",
                      marginLeft: 10,
                    }}
                  >
                    {skill.label}
                  </Text>

                  <Text
                    style={{
                      color: getScoreColor(skill.value),
                      fontSize: 14,
                      fontWeight: "800",
                    }}
                  >
                    {skill.value}%
                  </Text>
                </View>

                <View
                  style={{
                    height: 6,
                    backgroundColor: "#3F3F46",
                    borderRadius: 10,
                    overflow: "hidden",
                    marginTop: 12,
                  }}
                >
                  <View
                    style={{
                      width: `${skill.value}%`,
                      height: "100%",
                      backgroundColor: getScoreColor(skill.value),
                      borderRadius: 10,
                    }}
                  />
                </View>
              </View>
            ))}
      </ScrollView>

      <BottomNav active="progress" />
    </View>
  );
};

export default Progress;