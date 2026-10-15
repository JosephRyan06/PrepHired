import { API_URL } from "../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// CREATE INTERVIEW
export const createMockInterview = async ({
  targetJob,
  interviewCategory,
  responseMode,
  numberOfQuestions,
  timePerQuestion
}) => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/mobile/mockInterview`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      targetJob,
      interviewCategory,
      responseMode,
      numberOfQuestions,
      timePerQuestion
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message,
      errors: data.errors || {},
    };
  }

  return data;
};

// GET INTERVIEW
export const getMockInterview = async (interviewId) => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/mobile/mockInterview/${interviewId}`,
    {
      method: "GET",
      headers,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message,
      errors: data.errors || {},
    };
  }

  return data;
};

// SAVE ANSWER
export const saveInterviewAnswer = async ({
  interviewId,
  questionNumber,
  answer,
  audioUrl,
  timeUsed,
}) => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/mobile/mockInterview/${interviewId}/answer`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        questionNumber,
        answer,
        audioUrl,
        timeUsed,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message,
      errors: data.errors || {},
    };
  }

  return data;
};

// ANALYZE SINGLE ANSWER
// Keep this API available, even though the new flow
// does not call it during the interview.
export const analyzeInterviewAnswer = async ({
  interviewId,
  questionNumber,
}) => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/mobile/mockInterview/${interviewId}/analyze-answer`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        questionNumber,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message,
      errors: data.errors || {},
    };
  }

  return data;
};

// ANALYZE COMPLETE SESSION
export const analyzeInterviewSession = async (interviewId) => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/mobile/mockInterview/${interviewId}/analyze-session`,
    {
      method: "POST",
      headers,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message,
      errors: data.errors || {},
    };
  }

  return data;
};

// COMPLETE INTERVIEW
export const completeMockInterview = async (interviewId) => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/mobile/mockInterview/${interviewId}/complete`,
    {
      method: "PATCH",
      headers,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message,
      errors: data.errors || {},
    };
  }

  return data;
};

// GET COMPLETED INTERVIEWS
export const getCompletedMockInterviews = async () => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/mobile/mockInterview/completed`, {
    method: "GET",
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message,
      errors: data.errors || {},
    };
  }

  return data;
};
