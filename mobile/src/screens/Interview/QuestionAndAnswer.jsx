import React, { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";

import InterviewHeader from "../../components/InterviewHeader";
import Button from "../../components/Button";
import LoadingModal from "../../components/LoadingModal";
import AppModal from "../../components/AppModal";
import styles from "../../styles/global";

import useMockInterview from "../../hooks/useMockInterview";

import { questionAndAnswerHandler } from "../../handlers/interview/questionAndAnswerHandler";

const QuestionAndAnswer = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const mockInterviewId = route.params?.mockInterviewId;

  const {
    mockInterview,
    targetJob,
    interviewCategory,
    responseMode,
    numberOfQuestions,
    timePerQuestion
  } = route.params || {};

  const { saveAnswer, analyzeAnswer, analyzeSession, complete, loading } =
    useMockInterview();

  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [response, setResponse] = useState("");
  const [timeLeft, setTimeLeft] = useState(Number(timePerQuestion) || 60);
  const [answerError, setAnswerError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Prevent double submission / timeout
  const processingRef = useRef(false);
  const interviewCompletedRef = useRef(false);
  const timerPausedRef = useRef(false);
  const timeoutHandledRef = useRef(false);
  const [isAnswerProcessing, setIsAnswerProcessing] = useState(false);

  const {
    questions,
    totalQuestions,
    currentQuestionData,
    currentQuestionText,
    handleSaveAndContinue,
    handleTimeOut,
  } = questionAndAnswerHandler({
    mockInterview,
    currentQuestion,
    response,
    timeLeft,

    setCurrentQuestion,
    setResponse,
    setTimeLeft,
    setAnswerError,

    setModalVisible,
    setModalMessage,
    navigation,

    saveAnswer,
    analyzeAnswer,
    analyzeSession,
    complete,

    processingRef,
  });

  const isAnalyzingLastQuestion = loading && currentQuestion === totalQuestions;

  // --------------------------------
  // STOP SPEECH
  // --------------------------------

  const stopQuestionSpeech = async () => {
    try {
      await Speech.stop();
    } catch (error) {
      console.error("Speech stop error:", error);
    }

    setIsSpeaking(false);
  };

  // --------------------------------
  // SPEAK QUESTION
  // --------------------------------

  const speakQuestion = async () => {
    if (!currentQuestionText) {
      return;
    }

    try {
      // Stop any speech that may still be playing
      await Speech.stop();

      setIsSpeaking(true);

      Speech.speak(currentQuestionText, {
        language: "en-US",
        rate: 0.9,
        pitch: 1.0,

        onStart: () => {
          setIsSpeaking(true);
        },

        onDone: () => {
          setIsSpeaking(false);
        },

        onStopped: () => {
          setIsSpeaking(false);
        },

        onError: (error) => {
          console.error("Speech error:", error);
          setIsSpeaking(false);
        },
      });
    } catch (error) {
      console.error("Speech error:", error);
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    // Reset timer
    setTimeLeft(Number(timePerQuestion) || 60);

    // Reset answer
    setResponse("");

    // Reset error
    setAnswerError("");

    // Reset timeout protection
    timeoutHandledRef.current = false;

    // Stop previous question speech
    Speech.stop();

    setIsSpeaking(false);
  }, [currentQuestion]);

  useEffect(() => {
    if (!currentQuestionText) {
      return;
    }

    // Small delay to allow the new question
    // to render before speech starts
    const speechTimer = setTimeout(() => {
      speakQuestion();
    }, 300);

    return () => {
      clearTimeout(speechTimer);
      Speech.stop();
      setIsSpeaking(false);
    };
  }, [currentQuestionText]);

  useEffect(() => {
    if (timeLeft <= 0 || timerPausedRef.current) {
      return;
    }

    const timer = setInterval(() => {
      if (timerPausedRef.current || processingRef.current) {
        return;
      }

      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft !== 0) {
      return;
    }

    // Prevent timeout from being called
    // more than once for the same question
    if (timeoutHandledRef.current) {
      return;
    }

    // Prevent timeout while another answer
    // is already being processed
    if (processingRef.current) {
      return;
    }

    timeoutHandledRef.current = true;

    const processTimeout = async () => {
      // Stop question speech immediately
      await stopQuestionSpeech();

      try {
        await handleTimeOut();
      } catch (error) {
        console.error("Timeout error:", error);

        // Allow another attempt if the handler failed
        timeoutHandledRef.current = false;
      }
    };

    processTimeout();
  }, [timeLeft]);

  const handleReplayQuestion = async () => {
    if (!currentQuestionText) {
      return;
    }

    // Always restart the question speech
    await speakQuestion();
  };

  const handleEndInterview = async () => {
    // Stop speech before leaving the screen
    await stopQuestionSpeech();
  };

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: 130,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <InterviewHeader
          navigation={navigation}
          interviewLabel="Question & Answer"
          questionNumber={currentQuestion}
          mockInterviewId={mockInterviewId}
          navigateTo="Interview"
          showTimer={true}
          timerRunning={!isAnswerProcessing && !timerPausedRef.current}
          backIcon="exit"
          onExit={handleEndInterview}
          timePerQuestion={Number(timePerQuestion) || 60}
        />
        {/* QUESTION PROGRESS */}

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
              color: "#71717A",
              fontSize: 12,
              fontWeight: "700",
            }}
          >
            QUESTION {currentQuestion} OF {totalQuestions}
          </Text>
        </View>

        {/* PROGRESS BAR */}

        <View
          style={{
            height: 6,
            backgroundColor: "#18181F",
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: 24,
          }}
        >
          <View
            style={{
              width: `${
                totalQuestions > 0
                  ? Math.min((currentQuestion / totalQuestions) * 100, 100)
                  : 0
              }%`,
              height: "100%",
              backgroundColor: "#2563EB",
            }}
          />
        </View>

        {/* QUESTION CARD */}

        <View
          style={{
            backgroundColor: "#25252F",
            borderRadius: 18,
            padding: 20,
            marginBottom: 18,
          }}
        >
          {/* QUESTION HEADER */}

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
                flex: 1,
              }}
            >
              INTERVIEW QUESTION
            </Text>

            {/* REPLAY BUTTON */}

            <TouchableOpacity
              onPress={handleReplayQuestion}
              activeOpacity={0.7}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#18181F",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 10,
                marginLeft: 10,
              }}
            >
              <Ionicons name="volume-high" size={18} color="#60A5FA" />

              <Text
                style={{
                  color: "#60A5FA",
                  fontSize: 12,
                  fontWeight: "700",
                  marginLeft: 6,
                }}
              >
                Replay Question
              </Text>
            </TouchableOpacity>
          </View>

          {/* QUESTION TEXT */}

          <Text
            style={{
              color: "#F8FAFC",
              fontSize: 19,
              lineHeight: 28,
              fontWeight: "700",
            }}
          >
            {currentQuestionText}
          </Text>
        </View>

        {/* RESPONSE */}

        <View
          style={{
            backgroundColor: "#25252F",
            borderRadius: 18,
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
            YOUR ANSWER
          </Text>

          {/* AUDIO MODE */}

          {responseMode === "Audio" ? (
            <View
              style={{
                alignItems: "center",
                paddingVertical: 25,
              }}
            >
              <TouchableOpacity
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  backgroundColor: "#2563EB",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Ionicons name="mic" size={32} color="#FFFFFF" />
              </TouchableOpacity>

              <Text
                style={{
                  color: "#71717A",
                  fontSize: 13,
                  textAlign: "center",
                }}
              >
                Audio recording can be connected here.
              </Text>
            </View>
          ) : (
            /* TEXT MODE */

            <TextInput
              value={response}
              onChangeText={(text) => {
                setResponse(text);

                if (answerError) {
                  setAnswerError("");
                }
              }}
              multiline
              textAlignVertical="top"
              placeholder="Type your answer..."
              placeholderTextColor="#71717A"
              style={{
                minHeight: 180,
                backgroundColor: "#18181F",
                borderRadius: 12,
                padding: 15,
                color: "#F8FAFC",
                fontSize: 14,
                lineHeight: 22,
              }}
            />
          )}

          {/* ANSWER ERROR */}

          {answerError ? (
            <Text
              style={{
                color: "#DC2626",
                fontSize: 12,
                marginTop: 10,
              }}
            >
              {answerError}
            </Text>
          ) : null}
        </View>
      </ScrollView>

      {/* SAVE / SUBMIT BUTTON */}

      <Button
        style={{
          marginBottom: 65,
        }}
        title="Submit Answer"
        loading={loading}
        onPress={async () => {
          if (processingRef.current || interviewCompletedRef.current) {
            return;
          }

          timerPausedRef.current = true;
          setIsAnswerProcessing(true);

          try {
            await handleSaveAndContinue();
          } finally {
            if (!interviewCompletedRef.current) {
              timerPausedRef.current = false;
              setIsAnswerProcessing(false);
            }
          }
        }}
        disabled={loading || processingRef.current}
      />

      <AppModal
        visible={modalVisible}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />

      <LoadingModal
        visible={isAnalyzingLastQuestion}
        title="Analyzing Interview"
        message="Please wait while AI analyzes your final answer and completes your interview."
        icon="sparkles-outline"
      />
    </View>
  );
};

export default QuestionAndAnswer;
