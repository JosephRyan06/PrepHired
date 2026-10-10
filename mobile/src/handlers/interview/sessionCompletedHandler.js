export const sessionCompletedHandler = ({
  mockInterviewId,
  mockInterview,
  getById,
  navigation,
  setInterview,
  setLoading,
}) => {
  const loadInterview = async () => {
    if (mockInterview) {
      setInterview(mockInterview);
      return;
    }

    // No ID and no interview data.
    if (!mockInterviewId) {
      setInterview(null);
      return;
    }

    try {
      setLoading(true);

      const result = await getById(mockInterviewId);

      setInterview(result?.mockInterview || null);
    } catch (error) {
      console.error("Failed to load completed interview:", error);

      setInterview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAnswers = () => {
    navigation.navigate("ReviewAnswer", {
      mockInterviewId,
    });
  };

  const handleDone = () => {
    navigation.navigate("Home");
  };

  return {
    loadInterview,
    handleReviewAnswers,
    handleDone,
  };
};
