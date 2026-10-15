import { useState } from "react";

import {
  createMockInterview,
  getMockInterview,
  saveInterviewAnswer,
  analyzeInterviewAnswer,
  analyzeInterviewSession,
  completeMockInterview,
  getCompletedMockInterviews,
} from "../api/mockInterview";

const useMockInterview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // CREATE
  const create = async ({
    targetJob,
    interviewCategory,
    responseMode,
    numberOfQuestions,
    timePerQuestion
  }) => {
    try {
      setLoading(true);
      setError(null);

      const result = await createMockInterview({
        targetJob,
        interviewCategory,
        responseMode,
        numberOfQuestions,
        timePerQuestion
      });

      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // GET BY ID
  const getById = async (interviewId) => {
    try {
      setLoading(true);
      setError(null);

      const result = await getMockInterview(interviewId);

      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // SAVE ANSWER
  const saveAnswer = async ({
    interviewId,
    questionNumber,
    answer,
    audioUrl,
    timeUsed,
  }) => {
    try {
      setLoading(true);
      setError(null);

      const result = await saveInterviewAnswer({
        interviewId,
        questionNumber,
        answer,
        audioUrl,
        timeUsed,
      });

      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ANALYZE ANSWER
  const analyzeAnswer = async ({ interviewId, questionNumber }) => {
    try {
      setLoading(true);
      setError(null);

      const result = await analyzeInterviewAnswer({
        interviewId,
        questionNumber,
      });

      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ANALYZE SESSION
  const analyzeSession = async (interviewId) => {
    try {
      setLoading(true);
      setError(null);

      const result = await analyzeInterviewSession(interviewId);

      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // COMPLETE
  const complete = async (interviewId) => {
    try {
      setLoading(true);
      setError(null);

      const result = await completeMockInterview(interviewId);

      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // GET COMPLETED
  const getCompleted = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getCompletedMockInterviews();

      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    loading,
    error,

    create,
    getById,
    saveAnswer,
    analyzeAnswer,
    analyzeSession,
    complete,
    getCompleted,

    clearError,
  };
};

export default useMockInterview;
