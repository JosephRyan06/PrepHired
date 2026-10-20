import React, { useEffect, useState } from "react";

import { View, Text, TouchableOpacity, ScrollView } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";

import InterviewHeader from "../../../components/InterviewHeader";

import styles from "../../../styles/global";

import useMockInterview from "../../../hooks/useMockInterview";

import { reviewAnswerHandler } from "../../../handlers/interview/reviewAnswerHandler";

const CompletedReviewAnswer = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { mockInterviewId } = route.params || {};

  const { getById } = useMockInterview();

  const [interview, setInterview] = useState(null);

  const [loading, setLoading] = useState(false);

  const { loadInterview } = reviewAnswerHandler({
    mockInterviewId,
    getById,
    setInterview,
    setLoading,
  });

  useEffect(() => {
    loadInterview();
  }, [mockInterviewId]);

  const questions = interview?.questions || [];

  const handleOpenFeedback = (question, questionNumber) => {
    const responseMode = interview?.responseMode || "Text";

    const feedbackScreen =
      responseMode === "Audio" ? "AnswerAudioFeedback" : "CompletedAnswerTextFeedback";

    navigation.navigate(feedbackScreen, {
      mockInterviewId,
      questionNumber,
      totalQuestions: questions.length,
      question,
      analysis: {
        score: question.score,
        contentScore: question.contentScore,
        confidenceScore: question.confidenceScore,
        naturalScore: question.naturalScore,
        feedback: question.feedback,
        toneAndModulation: question.toneAndModulation,
        wordChoiceSuggestions: question.wordChoiceSuggestions || [],
        strengths: question.strengths || [],
        improvements: question.improvements || [],
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <InterviewHeader
          navigation={navigation}
          interviewLabel="Review Answers"
          showTimer={false}
          mockInterviewId={mockInterviewId}
          navigateTo="PreferencesSessionCompleted"
          goBack={true}
          backIcon="back"
        />

        {/* LOADING SKELETON */}
        {loading ? (
          <>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <View
                key={item}
                style={{
                  backgroundColor: "#25252F",
                  borderRadius: 16,
                  padding: 18,
                  marginBottom: 16,
                }}
              >
                {/* SKELETON QUESTION HEADER */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <View
                    style={{
                      width: 100,
                      height: 11,
                      borderRadius: 4,
                      backgroundColor: "#3A3A46",
                    }}
                  />

                  <View
                    style={{
                      width: 45,
                      height: 26,
                      borderRadius: 8,
                      backgroundColor: "#34343F",
                    }}
                  />
                </View>

                {/* SKELETON QUESTION */}
                <View
                  style={{
                    width: "90%",
                    height: 16,
                    borderRadius: 5,
                    backgroundColor: "#3A3A46",
                    marginBottom: 8,
                  }}
                />

                <View
                  style={{
                    width: "65%",
                    height: 16,
                    borderRadius: 5,
                    backgroundColor: "#34343F",
                    marginBottom: 16,
                  }}
                />

                {/* SKELETON ANSWER */}
                <View
                  style={{
                    backgroundColor: "#18181F",
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 14,
                  }}
                >
                  <View
                    style={{
                      width: 85,
                      height: 10,
                      borderRadius: 4,
                      backgroundColor: "#34343F",
                      marginBottom: 12,
                    }}
                  />

                  {[1, 2, 3].map((line) => (
                    <View
                      key={line}
                      style={{
                        width: line === 3 ? "55%" : "100%",
                        height: 10,
                        borderRadius: 4,
                        backgroundColor: "#3A3A46",
                        marginBottom: 8,
                      }}
                    />
                  ))}
                </View>

                {/* SKELETON AI FEEDBACK */}
                <View
                  style={{
                    marginBottom: 14,
                  }}
                >
                  <View
                    style={{
                      width: 100,
                      height: 11,
                      borderRadius: 4,
                      backgroundColor: "#34343F",
                      marginBottom: 10,
                    }}
                  />

                  <View
                    style={{
                      width: "100%",
                      height: 10,
                      borderRadius: 4,
                      backgroundColor: "#3A3A46",
                      marginBottom: 8,
                    }}
                  />

                  <View
                    style={{
                      width: "75%",
                      height: 10,
                      borderRadius: 4,
                      backgroundColor: "#34343F",
                    }}
                  />
                </View>

                {/* SKELETON VIEW FEEDBACK BUTTON */}
                <View
                  style={{
                    backgroundColor: "#18181F",
                    borderRadius: 10,
                    height: 40,
                  }}
                />
              </View>
            ))}
          </>
        ) : questions.length === 0 ? (
          <View
            style={{
              backgroundColor: "#25252F",
              borderRadius: 16,
              padding: 24,
            }}
          >
            <Text
              style={{
                color: "#71717A",
                textAlign: "center",
                fontSize: 14,
              }}
            >
              No interview answers are available.
            </Text>
          </View>
        ) : (
          questions.map((question, index) => {
            const questionNumber = question.questionNumber || index + 1;

            const score = Number(question.score) || 0;

            const answer = question.answer || "No answer provided.";

            return (
              <TouchableOpacity
                key={`${questionNumber}-${index}`}
                activeOpacity={0.85}
                onPress={() => handleOpenFeedback(question, questionNumber)}
                style={{
                  backgroundColor: "#25252F",
                  borderRadius: 16,
                  padding: 18,
                  marginBottom: 16,
                }}
              >
                {/* QUESTION NUMBER */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Text
                    style={{
                      color: "#60A5FA",
                      fontSize: 11,
                      fontWeight: "800",
                      letterSpacing: 1,
                    }}
                  >
                    QUESTION {questionNumber}
                  </Text>

                  <View
                    style={{
                      backgroundColor: "#18181F",
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: "#F8FAFC",
                        fontSize: 11,
                        fontWeight: "800",
                      }}
                    >
                      {score}%
                    </Text>
                  </View>
                </View>

                {/* QUESTION */}
                <Text
                  style={{
                    color: "#F8FAFC",
                    fontSize: 16,
                    lineHeight: 24,
                    fontWeight: "700",
                    marginBottom: 16,
                  }}
                >
                  {question.question}
                </Text>

                {/* ANSWER */}
                <View
                  style={{
                    backgroundColor: "#18181F",
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 14,
                  }}
                >
                  <Text
                    style={{
                      color: "#71717A",
                      fontSize: 10,
                      fontWeight: "800",
                      marginBottom: 7,
                    }}
                  >
                    YOUR ANSWER
                  </Text>

                  <Text
                    style={{
                      color: "#A1A1AA",
                      fontSize: 14,
                      lineHeight: 21,
                    }}
                  >
                    {answer}
                  </Text>
                </View>

                {/* AI FEEDBACK */}
                {question.feedback ? (
                  <View
                    style={{
                      marginBottom: 14,
                    }}
                  >
                    <Text
                      style={{
                        color: "#F8FAFC",
                        fontSize: 12,
                        fontWeight: "800",
                        marginBottom: 7,
                      }}
                    >
                      AI FEEDBACK
                    </Text>

                    <Text
                      style={{
                        color: "#A1A1AA",
                        fontSize: 13,
                        lineHeight: 20,
                      }}
                    >
                      {question.feedback}
                    </Text>
                  </View>
                ) : null}

                {/* VIEW FEEDBACK */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#18181F",
                    borderRadius: 10,
                    paddingVertical: 11,
                  }}
                >
                  <Text
                    style={{
                      color: "#60A5FA",
                      fontSize: 13,
                      fontWeight: "700",
                    }}
                  >
                    View Detailed Feedback
                  </Text>

                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color="#60A5FA"
                    style={{
                      marginLeft: 5,
                    }}
                  />
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default CompletedReviewAnswer;
