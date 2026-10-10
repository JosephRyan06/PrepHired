export const interviewHandler = ({
  targetJob,
  setTargetJob,
  setTargetJobError,
  setModalVisible,
  setModalMessage,
  selectedInterviewCategory,
  selectedResponseMode,
  selectedNumberOfQuestions,
  navigation,
  create,
}) => {
  const handleTargetJobChange = (text) => {
    setTargetJob(text);
    setTargetJobError("");
  };

  const handleStartInterview = async () => {
    try {
      const result = await create({
        targetJob: targetJob.trim(),
        interviewCategory: selectedInterviewCategory,
        responseMode: selectedResponseMode,
        numberOfQuestions: Number(selectedNumberOfQuestions),
      });

      if (!result.success) {
        if (result.errors?.targetJob) {
          setTargetJobError(result.errors.targetJob);
          return;
        }

        setModalMessage(result.message || "Failed to create mock interview");
        setModalVisible(true);

        return;
      }

      const mockInterviewId = result.mockInterview?.id;

      navigation.navigate("QuestionAndAnswer", {
        mockInterviewId,
        mockInterview: result.mockInterview,
        targetJob: targetJob.trim(),
        interviewCategory: selectedInterviewCategory,
        responseMode: selectedResponseMode,
        numberOfQuestions: Number(selectedNumberOfQuestions),
      });
    } catch (error) {
      setModalMessage(error?.message || "Failed to create mock interview");
      setModalVisible(true);
    }
  };

  return {
    handleTargetJobChange,
    handleStartInterview,
  };
};
