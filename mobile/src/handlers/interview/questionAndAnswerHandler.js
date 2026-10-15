export const questionAndAnswerHandler = ({
  mockInterview,
  currentQuestion,
  response,
  timeLeft,
  timePerQuestion,

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

  const questionTimeLimit = Number(timePerQuestion) || 60;

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

        timeUsed: Math.max(0, questionTimeLimit - timeLeft),
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

      const nextQuestion = currentQuestion + 1;

      if (nextQuestion > totalQuestions) {
        return;
      }

      setResponse("");

      setTimeLeft(questionTimeLimit);

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

        if (trimmedAnswer) {
          savedResult = await saveAnswer({
            interviewId: mockInterview._id,

            questionNumber: currentQuestion,

            answer: trimmedAnswer,

            audioUrl: "",

            timeUsed: questionTimeLimit,
          });

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

          timeUsed: questionTimeLimit,
        });

        await analyzeAnswer({
          interviewId: mockInterview._id,

          questionNumber: currentQuestion,
        });
      }

      const nextQuestion = currentQuestion + 1;

      setResponse("");

      setAnswerError("");

      setTimeLeft(questionTimeLimit);

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