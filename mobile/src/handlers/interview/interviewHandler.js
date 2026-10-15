export const interviewHandler = ({
  targetJob,
  setTargetJob,
  setTargetJobError,
  setModalVisible,
  setModalMessage,
  selectedInterviewCategory,
  selectedResponseMode,
  selectedNumberOfQuestions,
  selectedTimePerQuestion,
  navigation,
  create,
}) => {
  const handleTargetJobChange = (text) => {
    setTargetJob(text);
    setTargetJobError("");
  };

  const handleStartInterview = async () => {
    setTargetJobError("");

    try {
      const result = await create({
        targetJob: targetJob.trim(),
        interviewCategory: selectedInterviewCategory,
        responseMode: selectedResponseMode,
        numberOfQuestions: Number(selectedNumberOfQuestions),
        timePerQuestion: Number(selectedTimePerQuestion),
      });

      if (!result.success) {
        if (result.errors?.targetJob) {
          setTargetJobError(result.errors.targetJob);
          return;
        }

        setModalMessage(
          result.message || "Failed to create mock interview"
        );
        setModalVisible(true);
        return;
      }

      navigation.navigate("QuestionAndAnswer", {
        mockInterviewId: result.mockInterview?.id,
        mockInterview: result.mockInterview,
        targetJob: targetJob.trim(),
        interviewCategory: selectedInterviewCategory,
        responseMode: selectedResponseMode,
        numberOfQuestions: Number(selectedNumberOfQuestions),
        timePerQuestion: Number(selectedTimePerQuestion),
      });
    } catch (error) {
      if (error.errors?.targetJob) {
        setTargetJobError(error.errors.targetJob);
        return;
      }

      setModalMessage(
        error.message || "Failed to create mock interview"
      );
      setModalVisible(true);
    }
  };

  return {
    handleTargetJobChange,
    handleStartInterview,
  };
};