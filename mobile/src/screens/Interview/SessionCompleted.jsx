import React, { useEffect, useState } from "react";

import { View, Text, ScrollView, TouchableOpacity } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";

import Button from "../../components/Button";

import styles from "../../styles/global";

import useMockInterview from "../../hooks/useMockInterview";

import { sessionCompletedHandler } from "../../handlers/interview/sessionCompletedHandler";

const SessionCompleted = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { mockInterviewId, mockInterview } = route.params || {};

  const { getById } = useMockInterview();

  const [interview, setInterview] = useState(mockInterview || null);

  const [loading, setLoading] = useState(false);

  const { loadInterview, handleReviewAnswers, handleDone } =
    sessionCompletedHandler({
      mockInterviewId,
      mockInterview,
      getById,
      navigation,
      setInterview,
      setLoading,
    });

  useEffect(() => {
    loadInterview();
  }, [mockInterviewId]);

  const overallScore = Number(interview?.overallScore) || 0;

  const skillBreakdown = interview?.skillBreakdown || {};

  const skillEntries = Array.isArray(skillBreakdown)
    ? skillBreakdown
    : Object.entries(skillBreakdown).map(([name, score]) => ({
        name,
        score,
      }));

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SUCCESS ICON */}
        <View
          style={{
            marginTop: 50,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: "#2563EB",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Ionicons name="checkmark" size={40} color="#FFFFFF" />
          </View>

          <Text
            style={{
              color: "#F8FAFC",
              fontSize: 26,
              fontWeight: "800",
              textAlign: "center",
            }}
          >
            Session Completed
          </Text>

          <Text
            style={{
              color: "#71717A",
              fontSize: 14,
              textAlign: "center",
              marginTop: 8,
            }}
          >
            Your interview has been analyzed by AI.
          </Text>
        </View>

        {/* SCORE */}
        <View
          style={{
            backgroundColor: "#25252F",
            padding: 24,
            borderRadius: 18,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: "#71717A",
              fontSize: 11,
              fontWeight: "800",
              textAlign: "center",
              letterSpacing: 1,
              marginBottom: 10,
            }}
          >
            OVERALL SCORE
          </Text>

          <Text
            style={{
              color: "#F8FAFC",
              fontSize: 48,
              fontWeight: "800",
              textAlign: "center",
            }}
          >
            {overallScore}%
          </Text>

          <View
            style={{
              height: 8,
              backgroundColor: "#18181F",
              borderRadius: 20,
              overflow: "hidden",
              marginTop: 15,
            }}
          >
            <View
              style={{
                width: `${Math.min(Math.max(overallScore, 0), 100)}%`,
                height: "100%",
                backgroundColor: "#2563EB",
              }}
            />
          </View>
        </View>

        {/* SKILL BREAKDOWN */}
        <View
          style={{
            backgroundColor: "#25252F",
            padding: 24,
            borderRadius: 18,
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              color: "#F8FAFC",
              fontSize: 13,
              fontWeight: "800",
              marginBottom: 18,
            }}
          >
            SKILL BREAKDOWN
          </Text>

          {skillEntries.length === 0 ? (
            <Text
              style={{
                color: "#71717A",
                fontSize: 13,
              }}
            >
              No skill breakdown is available.
            </Text>
          ) : (
            skillEntries.map((skill, index) => {
              const score = Number(skill?.score ?? skill?.value ?? 0) || 0;

              const skillNames = [
                "COMMUNICATION",
                "TECHNICAL KNOWLEDGE",
                "PROBLEM SOLVING",
                "CONFIDENCE",
                "RELEVANCE",
              ];

              const name =
                skillNames[index] ||
                skill?.name ||
                skill?.skill ||
                `Skill ${index + 1}`;

              return (
                <View
                  key={`${name}-${index}`}
                  style={{
                    marginBottom: index === skillEntries.length - 1 ? 0 : 16,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 7,
                    }}
                  >
                    <Text
                      style={{
                        color: "#A1A1AA",
                        fontSize: 13,
                        fontWeight: "600",
                      }}
                    >
                      {name}
                    </Text>

                    <Text
                      style={{
                        color: "#F8FAFC",
                        fontSize: 13,
                        fontWeight: "700",
                      }}
                    >
                      {score}%
                    </Text>
                  </View>

                  <View
                    style={{
                      height: 6,
                      backgroundColor: "#18181F",
                      borderRadius: 20,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        width: `${Math.min(Math.max(score, 0), 100)}%`,
                        height: "100%",
                        backgroundColor: "#2563EB",
                      }}
                    />
                  </View>
                </View>
              );
            })
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
          title="Review Answer"
          onPress={handleReviewAnswers}
          disabled={loading}
        />

        <Button
          style={{
            marginBottom: 15,
            width: "48%",
          }}
          title="Done"
          onPress={handleDone}
          disabled={loading}
        />
      </View>
    </View>
  );
};

export default SessionCompleted;
