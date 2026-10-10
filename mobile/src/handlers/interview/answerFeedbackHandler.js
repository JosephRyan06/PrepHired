export const answerFeedbackHandler = ({ mockInterviewId, navigation }) => {
  const handleContinue = () => {
    navigation.navigate("ReviewAnswer", {
      mockInterviewId,
    });
  };

  return {
    handleContinue,
  };
};
