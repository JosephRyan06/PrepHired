export const questionAndAnswerHandler = ({
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
}) => {
  const questions = mockInterview?.questions || [];

  const totalQuestions = questions.length;

  const currentQuestionData = questions[currentQuestion - 1];

  const currentQuestionText = currentQuestionData?.question || "";

  const handleSaveAndContinue = async () => {
    if (processingRef?.current) {
      return;
    }

    if (!mockInterview?._id) {
      throw new Error("Mock interview was not found.");
    }

    if (!currentQuestionData) {
      throw new Error("Question was not found.");
    }

    const trimmedAnswer = response?.trim() || "";

    if (!trimmedAnswer) {
      setAnswerError("Please provide an answer before continuing.");

      return;
    }

    setAnswerError("");

    if (processingRef) {
      processingRef.current = true;
    }

    try {
      // --------------------------------
      // SAVE ANSWER
      // --------------------------------

      const savedResult = await saveAnswer({
        interviewId: mockInterview._id,

        questionNumber: currentQuestion,

        answer: trimmedAnswer,

        audioUrl: "",

        timeUsed: Math.max(0, 60 - timeLeft),
      });

      // --------------------------------
      // ANALYZE ANSWER
      // --------------------------------

      const answerAnalysis = await analyzeAnswer({
        interviewId: mockInterview._id,

        questionNumber: currentQuestion,
      });

      // --------------------------------
      // FINAL QUESTION
      // --------------------------------

      if (currentQuestion >= totalQuestions) {
        // Complete interview only
        // AFTER saving and analyzing
        // the final answer.
        const completedResult = await complete(mockInterview._id);

        // Analyze the complete session
        // AFTER the interview is completed.
        const sessionAnalysis = await analyzeSession(mockInterview._id);

        navigation.navigate("SessionCompleted", {
          mockInterviewId: mockInterview._id,

          mockInterview:
            sessionAnalysis?.mockInterview ||
            completedResult?.mockInterview ||
            answerAnalysis?.mockInterview ||
            savedResult?.mockInterview ||
            mockInterview,
        });

        return;
      }

      // --------------------------------
      // NEXT QUESTION
      // --------------------------------

      const nextQuestion = currentQuestion + 1;

      if (nextQuestion > totalQuestions) {
        return;
      }

      setResponse("");

      setTimeLeft(60);

      setCurrentQuestion(nextQuestion);
    } catch (error) {
      console.error("Question and answer flow error:", error);

      const message =
        error?.message ||
        "Something went wrong while saving or analyzing your answer.";

      setAnswerError("");
      setModalMessage(message);
      setModalVisible(true);
    } finally {
      if (processingRef) {
        processingRef.current = false;
      }
    }
  };

  const handleTimeOut = async () => {
    if (timeLeft > 0) {
      return;
    }

    if (currentQuestion < 1 || currentQuestion > totalQuestions) {
      return;
    }

    if (processingRef?.current) {
      return;
    }

    if (processingRef) {
      processingRef.current = true;
    }

    try {
      const trimmedAnswer = response?.trim() || "";

      // --------------------------------
      // FINAL QUESTION TIMEOUT
      // --------------------------------

      if (currentQuestion >= totalQuestions) {
        let savedResult = null;
        let answerAnalysis = null;

        // If an answer exists, save it
        // before completing the interview.
        if (trimmedAnswer) {
          savedResult = await saveAnswer({
            interviewId: mockInterview._id,

            questionNumber: currentQuestion,

            answer: trimmedAnswer,

            audioUrl: "",

            timeUsed: 60,
          });

          // Analyze the final answer
          // before completing the interview.
          answerAnalysis = await analyzeAnswer({
            interviewId: mockInterview._id,

            questionNumber: currentQuestion,
          });
        }

        const sessionAnalysis = await analyzeSession(mockInterview._id);

        const completedResult = await complete(mockInterview._id);

        navigation.navigate("SessionCompleted", {
          mockInterviewId: mockInterview._id,

          mockInterview:
            sessionAnalysis?.mockInterview ||
            completedResult?.mockInterview ||
            answerAnalysis?.mockInterview ||
            savedResult?.mockInterview ||
            mockInterview,
        });

        return;
      }

      // --------------------------------
      // NEXT QUESTION
      // --------------------------------

      if (trimmedAnswer) {
        await saveAnswer({
          interviewId: mockInterview._id,

          questionNumber: currentQuestion,

          answer: trimmedAnswer,

          audioUrl: "",

          timeUsed: 60,
        });

        await analyzeAnswer({
          interviewId: mockInterview._id,

          questionNumber: currentQuestion,
        });
      }

      const nextQuestion = currentQuestion + 1;

      setResponse("");

      setAnswerError("");

      setTimeLeft(60);

      setCurrentQuestion(nextQuestion);
    } catch (error) {
      console.error("Question and answer flow error:", error);

      const message =
        error?.message ||
        "Something went wrong while saving or analyzing your answer.";

      setAnswerError("");
      setModalMessage(message);
      setModalVisible(true);
    } finally {
      if (processingRef) {
        processingRef.current = false;
      }
    }
  };

  return {
    questions,
    totalQuestions,
    currentQuestionData,
    currentQuestionText,
    handleSaveAndContinue,
    handleTimeOut,
  };
};
