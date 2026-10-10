import React from "react";

import { View, Text, ScrollView } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";

import InterviewHeader from "../../components/InterviewHeader";
import Button from "../../components/Button";

import styles from "../../styles/global";

import { answerFeedbackHandler } from "../../handlers/interview/answerFeedbackHandler";

const ScoreCard = ({ title, score }) => {
  const safeScore = Number(score) || 0;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#25252F",
        borderRadius: 14,
        padding: 16,
        marginHorizontal: 4,
      }}
    >
      <Text
        style={{
          color: "#71717A",
          fontSize: 10,
          fontWeight: "800",
          marginBottom: 8,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          color: "#F8FAFC",
          fontSize: 25,
          fontWeight: "800",
        }}
      >
        {safeScore}%
      </Text>

      <View
        style={{
          height: 5,
          backgroundColor: "#18181F",
          borderRadius: 20,
          overflow: "hidden",
          marginTop: 10,
        }}
      >
        <View
          style={{
            width: `${Math.min(Math.max(safeScore, 0), 100)}%`,
            height: "100%",
            backgroundColor: "#2563EB",
          }}
        />
      </View>
    </View>
  );
};

const AnswerAudioFeedback = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { mockInterviewId, questionNumber, question, analysis } =
    route.params || {};

  const { handleContinue } = answerFeedbackHandler({
    mockInterviewId,
    navigation,
  });

  // --------------------------------
  // SAFE DATA
  // --------------------------------

  const feedback =
    typeof analysis?.feedback === "string"
      ? analysis.feedback
      : "No additional feedback was provided.";

  const tone =
    typeof analysis?.toneAndModulation === "string"
      ? analysis.toneAndModulation
      : "No tone and modulation feedback was provided.";

  const strengths = Array.isArray(analysis?.strengths)
    ? analysis.strengths.filter((item) => typeof item === "string")
    : [];

  const improvements = Array.isArray(analysis?.improvements)
    ? analysis.improvements.filter((item) => typeof item === "string")
    : [];

  const wordChoiceSuggestions = Array.isArray(analysis?.wordChoiceSuggestions)
    ? analysis.wordChoiceSuggestions
    : [];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <InterviewHeader
          navigation={navigation}
          interviewLabel="Answer Feedback"
          showTimer={false}
          mockInterviewId={mockInterviewId}
          navigateTo="ReviewAnswer"
          backIcon="back"
        />

        {/* QUESTION */}

        {question?.question ? (
          <View
            style={{
              backgroundColor: "#25252F",
              borderRadius: 16,
              padding: 18,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: "#60A5FA",
                fontSize: 11,
                fontWeight: "800",
                letterSpacing: 1,
                marginBottom: 10,
              }}
            >
              QUESTION {questionNumber || ""}
            </Text>

            <Text
              style={{
                color: "#F8FAFC",
                fontSize: 17,
                lineHeight: 25,
                fontWeight: "700",
              }}
            >
              {question.question}
            </Text>
          </View>
        ) : null}

        {/* SCORES */}

        <View
          style={{
            flexDirection: "row",
            marginHorizontal: -4,
            marginBottom: 20,
          }}
        >
          <ScoreCard title="CONTENT" score={analysis?.contentScore} />

          <ScoreCard title="CONFIDENCE" score={analysis?.confidenceScore} />

          <ScoreCard title="NATURAL" score={analysis?.naturalScore} />
        </View>

        {/* OVERALL SCORE */}

        <View
          style={{
            backgroundColor: "#25252F",
            borderRadius: 16,
            padding: 18,
            marginBottom: 16,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#71717A",
              fontSize: 10,
              fontWeight: "800",
              marginBottom: 8,
            }}
          >
            OVERALL SCORE
          </Text>

          <Text
            style={{
              color: "#60A5FA",
              fontSize: 38,
              fontWeight: "900",
            }}
          >
            {Number(analysis?.score) || 0}%
          </Text>
        </View>

        {/* FEEDBACK */}

        <View
          style={{
            backgroundColor: "#25252F",
            borderRadius: 16,
            padding: 18,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: "#F8FAFC",
              fontSize: 13,
              fontWeight: "800",
              marginBottom: 10,
            }}
          >
            FEEDBACK
          </Text>

          <Text
            style={{
              color: "#A1A1AA",
              fontSize: 14,
              lineHeight: 22,
            }}
          >
            {feedback}
          </Text>
        </View>

        {/* TONE */}

        <View
          style={{
            backgroundColor: "#25252F",
            borderRadius: 16,
            padding: 18,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: "#F8FAFC",
              fontSize: 13,
              fontWeight: "800",
              marginBottom: 10,
            }}
          >
            TONE & MODULATION
          </Text>

          <Text
            style={{
              color: "#A1A1AA",
              fontSize: 14,
              lineHeight: 22,
            }}
          >
            {tone}
          </Text>
        </View>

        {/* WORD CHOICE SUGGESTIONS */}

        {wordChoiceSuggestions.length > 0 && (
          <View
            style={{
              backgroundColor: "#25252F",
              borderRadius: 16,
              padding: 18,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: "#F8FAFC",
                fontSize: 13,
                fontWeight: "800",
                marginBottom: 12,
              }}
            >
              WORD CHOICE SUGGESTIONS
            </Text>

            {wordChoiceSuggestions.map((item, index) => {
              const original = typeof item === "object" ? item?.original : "";

              const suggestion =
                typeof item === "object" ? item?.suggestion : "";

              const reason = typeof item === "object" ? item?.reason : "";

              return (
                <View
                  key={item?._id || index}
                  style={{
                    backgroundColor: "#18181F",
                    borderRadius: 12,
                    padding: 14,
                    marginBottom:
                      index < wordChoiceSuggestions.length - 1 ? 10 : 0,
                  }}
                >
                  {/* ORIGINAL */}

                  <Text
                    style={{
                      color: "#71717A",
                      fontSize: 10,
                      fontWeight: "800",
                      marginBottom: 5,
                    }}
                  >
                    ORIGINAL
                  </Text>

                  <Text
                    style={{
                      color: "#F8FAFC",
                      fontSize: 14,
                      lineHeight: 21,
                      marginBottom: 12,
                    }}
                  >
                    {original || "No original phrase provided."}
                  </Text>

                  {/* SUGGESTION */}

                  <Text
                    style={{
                      color: "#60A5FA",
                      fontSize: 10,
                      fontWeight: "800",
                      marginBottom: 5,
                    }}
                  >
                    SUGGESTION
                  </Text>

                  <Text
                    style={{
                      color: "#F8FAFC",
                      fontSize: 14,
                      lineHeight: 21,
                      marginBottom: 12,
                    }}
                  >
                    {suggestion || "No suggestion provided."}
                  </Text>

                  {/* REASON */}

                  <Text
                    style={{
                      color: "#71717A",
                      fontSize: 10,
                      fontWeight: "800",
                      marginBottom: 5,
                    }}
                  >
                    WHY
                  </Text>

                  <Text
                    style={{
                      color: "#A1A1AA",
                      fontSize: 13,
                      lineHeight: 20,
                    }}
                  >
                    {reason || "No reason provided."}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* NO WORD SUGGESTIONS */}

        {wordChoiceSuggestions.length === 0 && (
          <View
            style={{
              backgroundColor: "#25252F",
              borderRadius: 16,
              padding: 18,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: "#F8FAFC",
                fontSize: 13,
                fontWeight: "800",
                marginBottom: 10,
              }}
            >
              WORD CHOICE SUGGESTIONS
            </Text>

            <Text
              style={{
                color: "#71717A",
                fontSize: 14,
                lineHeight: 22,
              }}
            >
              No word choice suggestions were provided.
            </Text>
          </View>
        )}

        {/* STRENGTHS */}

        {strengths.length > 0 && (
          <View
            style={{
              backgroundColor: "#25252F",
              borderRadius: 16,
              padding: 18,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: "#F8FAFC",
                fontSize: 13,
                fontWeight: "800",
                marginBottom: 12,
              }}
            >
              STRENGTHS
            </Text>

            {strengths.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  marginBottom: 9,
                }}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color="#60A5FA"
                  style={{
                    marginRight: 8,
                  }}
                />

                <Text
                  style={{
                    flex: 1,
                    color: "#A1A1AA",
                    fontSize: 14,
                    lineHeight: 21,
                  }}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* IMPROVEMENTS */}

        {improvements.length > 0 && (
          <View
            style={{
              backgroundColor: "#25252F",
              borderRadius: 16,
              padding: 18,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                color: "#F8FAFC",
                fontSize: 13,
                fontWeight: "800",
                marginBottom: 12,
              }}
            >
              IMPROVEMENTS
            </Text>

            {improvements.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  marginBottom: 9,
                }}
              >
                <Ionicons
                  name="arrow-forward-circle"
                  size={18}
                  color="#60A5FA"
                  style={{
                    marginRight: 8,
                  }}
                />

                <Text
                  style={{
                    flex: 1,
                    color: "#A1A1AA",
                    fontSize: 14,
                    lineHeight: 21,
                  }}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default AnswerAudioFeedback;
