import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";
import InterviewHeader from "../../components/InterviewHeader";
import styles from "../../styles/global";
import useMockInterview from "../../hooks/useMockInterview";

const HomeInterviewHistory = () => {
  const navigation = useNavigation();

  const { getCompleted, loading } = useMockInterview();

  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    loadCompletedInterviews();
  }, []);

  const loadCompletedInterviews = async () => {
    try {
      const result = await getCompleted();

      const completed = result?.mockInterviews || [];

      setInterviews(Array.isArray(completed) ? completed : []);
    } catch (error) {
      console.log("Failed to load completed interviews:", error);

      setInterviews([]);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) {
      return "#22C55E";
    }

    if (score >= 60) {
      return "#F59E0B";
    }

    return "#EF4444";
  };

  const handleOpenInterview = (interview) => {
    if (!interview?._id) return;

    navigation.navigate("HomeSessionCompleted", {
      mockInterviewId: interview._id,
    });
  };


  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            flexGrow: 1,
            paddingBottom: 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <InterviewHeader
          navigation={navigation}
          interviewLabel="Interview History"
          showTimer={false}
          navigateTo="Home"
          goBack={true}
          backIcon="back"
        />

        {loading ? (
          <>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <View
                key={item}
                style={{
                  backgroundColor: "#25252F",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 14,
                  borderWidth: 1,
                  borderColor: "#3F3F4A",
                }}
              >
                {/* SKELETON HEADER */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      paddingRight: 12,
                    }}
                  >
                    <View
                      style={{
                        width: "65%",
                        height: 16,
                        borderRadius: 5,
                        backgroundColor: "#3A3A46",
                      }}
                    />

                    <View
                      style={{
                        width: "45%",
                        height: 11,
                        borderRadius: 4,
                        backgroundColor: "#34343F",
                        marginTop: 9,
                      }}
                    />
                  </View>

                  {/* SKELETON SCORE */}
                  <View
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: 29,
                      backgroundColor: "#34343F",
                    }}
                  />
                </View>

                {/* SKELETON DETAILS */}
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 18,
                    paddingTop: 14,
                    borderTopWidth: 1,
                    borderTopColor: "#3F3F4A",
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        width: 55,
                        height: 9,
                        borderRadius: 3,
                        backgroundColor: "#34343F",
                      }}
                    />

                    <View
                      style={{
                        width: 30,
                        height: 12,
                        borderRadius: 4,
                        backgroundColor: "#3A3A46",
                        marginTop: 7,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        width: 60,
                        height: 9,
                        borderRadius: 3,
                        backgroundColor: "#34343F",
                      }}
                    />

                    <View
                      style={{
                        width: 75,
                        height: 12,
                        borderRadius: 4,
                        backgroundColor: "#3A3A46",
                        marginTop: 7,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      alignItems: "flex-end",
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 9,
                        borderRadius: 3,
                        backgroundColor: "#34343F",
                      }}
                    />

                    <View
                      style={{
                        width: 65,
                        height: 12,
                        borderRadius: 4,
                        backgroundColor: "#3A3A46",
                        marginTop: 7,
                      }}
                    />
                  </View>
                </View>
              </View>
            ))}
          </>
        ) : interviews.length === 0 ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 50,
            }}
          >
            <Ionicons name="document-text-outline" size={42} color="#71717A" />

            <Text
              style={{
                color: "#F8FAFC",
                fontSize: 14,
                fontWeight: "700",
                marginTop: 12,
                textAlign: "center",
              }}
            >
              No completed interviews
            </Text>

            <Text
              style={{
                color: "#71717A",
                fontSize: 12,
                marginTop: 6,
                textAlign: "center",
              }}
            >
              Complete a mock interview to see it here.
            </Text>
          </View>
        ) : (
          <View>
            {interviews.map((interview, index) => {
              if (!interview) {
                return null;
              }

              const score = Number(interview.overallScore) || 0;

              return (
                <TouchableOpacity
                  key={interview._id || index}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: "#25252F",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 14,
                    borderWidth: 1,
                    borderColor: "#3F3F4A",
                  }}
                  onPress={() => handleOpenInterview(interview)}
                >
                  {/* HEADER */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        paddingRight: 12,
                      }}
                    >
                      <Text
                        style={{
                          color: "#F8FAFC",
                          fontSize: 16,
                          fontWeight: "700",
                        }}
                        numberOfLines={1}
                      >
                        {interview.targetJob || "Mock Interview"}
                      </Text>

                      <Text
                        style={{
                          color: "#A1A1AA",
                          fontSize: 12,
                          marginTop: 5,
                        }}
                      >
                        {interview.interviewCategory || "All"}
                        {" • "}
                        {interview.responseMode || "Text"}
                      </Text>
                    </View>

                    {/* SCORE */}
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: 58,
                        height: 58,
                        borderRadius: 29,
                        backgroundColor: "#18181F",
                        borderWidth: 2,
                        borderColor: getScoreColor(score),
                      }}
                    >
                      <Text
                        style={{
                          color: getScoreColor(score),
                          fontSize: 16,
                          fontWeight: "800",
                        }}
                      >
                        {score}
                      </Text>

                      <Text
                        style={{
                          color: "#71717A",
                          fontSize: 8,
                        }}
                      >
                        SCORE
                      </Text>
                    </View>
                  </View>

                  {/* DETAILS */}
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 18,
                      paddingTop: 14,
                      borderTopWidth: 1,
                      borderTopColor: "#3F3F4A",
                    }}
                  >
                    {/* QUESTIONS */}
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <Text
                        style={{
                          color: "#71717A",
                          fontSize: 10,
                          textTransform: "uppercase",
                        }}
                      >
                        Questions
                      </Text>

                      <Text
                        style={{
                          color: "#E4E4E7",
                          fontSize: 13,
                          fontWeight: "600",
                          marginTop: 4,
                        }}
                      >
                        {interview.numberOfQuestions ||
                          interview.questions?.length ||
                          0}
                      </Text>
                    </View>

                    {/* COMPLETED DATE */}
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <Text
                        style={{
                          color: "#71717A",
                          fontSize: 10,
                          textTransform: "uppercase",
                        }}
                      >
                        Completed
                      </Text>

                      <Text
                        style={{
                          color: "#E4E4E7",
                          fontSize: 13,
                          fontWeight: "600",
                          marginTop: 4,
                        }}
                      >
                        {formatDate(interview.completedAt)}
                      </Text>
                    </View>

                    {/* STATUS */}
                    <View
                      style={{
                        alignItems: "flex-end",
                      }}
                    >
                      <Text
                        style={{
                          color: "#71717A",
                          fontSize: 10,
                          textTransform: "uppercase",
                        }}
                      >
                        Status
                      </Text>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 5,
                        }}
                      >
                        <View
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: 4,
                            backgroundColor: "#22C55E",
                            marginRight: 5,
                          }}
                        />

                        <Text
                          style={{
                            color: "#22C55E",
                            fontSize: 12,
                            fontWeight: "600",
                          }}
                        >
                          Completed
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeInterviewHistory;
