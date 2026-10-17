/*
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
*/
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

  setIsProcessing, // NEW (state copy of processingRef, for the UI/timer)
  setCompleted, // NEW

  navigation,

  saveAnswer,
  analyzeAnswer,
  analyzeSession,
  complete,

  processingRef,
  completedRef, // NEW
}) => {
  const questions = mockInterview?.questions || [];
  const totalQuestions = questions.length;
  const currentQuestionData = questions[currentQuestion - 1];
  const currentQuestionText = currentQuestionData?.question || "";
  const questionTimeLimit = Number(timePerQuestion) || 60;

  const lock = () => {
    if (processingRef) processingRef.current = true;
    setIsProcessing?.(true);
  };

  const unlock = () => {
    if (processingRef) processingRef.current = false;
    setIsProcessing?.(false);
  };

  const isBlocked = () => processingRef?.current || completedRef?.current;

  const saveAndAnalyze = async (answer, timeUsed) => {
    const savedResult = await saveAnswer({
      interviewId: mockInterview._id,
      questionNumber: currentQuestion,
      answer,
      audioUrl: "",
      timeUsed,
    });

    const answerAnalysis = await analyzeAnswer({
      interviewId: mockInterview._id,
      questionNumber: currentQuestion,
    });

    return { savedResult, answerAnalysis };
  };

  const finishInterview = async ({ savedResult, answerAnalysis }) => {
    const sessionAnalysis = await analyzeSession(mockInterview._id);
    const completedResult = await complete(mockInterview._id);

    // Block any further save / timeout calls
    if (completedRef) completedRef.current = true;
    setCompleted?.(true);

    setResponse("");
    setAnswerError("");

    // replace() removes the question screen, so its timer can't fire later
    navigation.replace("SessionCompleted", {
      mockInterviewId: mockInterview._id,
      mockInterview:
        sessionAnalysis?.mockInterview ||
        completedResult?.mockInterview ||
        answerAnalysis?.mockInterview ||
        savedResult?.mockInterview ||
        mockInterview,
    });
  };

  const goToNextQuestion = () => {
    setResponse("");
    setAnswerError("");
    setTimeLeft(questionTimeLimit);
    setCurrentQuestion(currentQuestion + 1);
  };

  const showError = (error) => {
    console.error("Question and answer flow error:", error);

    setAnswerError("");
    setModalMessage(
      error?.message ||
        "Something went wrong while saving or analyzing your answer.",
    );
    setModalVisible(true);
  };

  // ------------------------------------------------------------
  // SAVE & CONTINUE
  // ------------------------------------------------------------

  const handleSaveAndContinue = async () => {
    if (isBlocked()) return;

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
    lock();

    try {
      const result = await saveAndAnalyze(
        trimmedAnswer,
        Math.max(0, questionTimeLimit - timeLeft),
      );

      if (currentQuestion >= totalQuestions) {
        await finishInterview(result);
        return;
      }

      goToNextQuestion();
    } catch (error) {
      showError(error);
    } finally {
      // Stay locked once completed
      if (!completedRef?.current) unlock();
    }
  };

  // ------------------------------------------------------------
  // TIMEOUT
  // ------------------------------------------------------------

  const handleTimeOut = async () => {
    if (isBlocked()) return;
    if (timeLeft > 0) return;
    if (currentQuestion < 1 || currentQuestion > totalQuestions) return;

    lock();

    try {
      const trimmedAnswer = response?.trim() || "";

      let result = { savedResult: null, answerAnalysis: null };

      if (trimmedAnswer) {
        result = await saveAndAnalyze(trimmedAnswer, questionTimeLimit);
      }

      if (currentQuestion >= totalQuestions) {
        await finishInterview(result);
        return;
      }

      goToNextQuestion();
    } catch (error) {
      showError(error);
    } finally {
      if (!completedRef?.current) unlock();
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