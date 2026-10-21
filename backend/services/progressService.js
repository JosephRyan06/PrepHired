const Resume = require("../models/resume");
const MockInterview = require("../models/mockInterview");

const getProgress = async (userId) => {
  // ==========================================
  // GET COMPLETED RESUMES
  // ==========================================

  const resumes = await Resume.find({
    userId,
    status: "completed",
  }).sort({
    createdAt: -1,
  });

  // ==========================================
  // RESUME AVERAGE (ALL COMPLETED RESUMES)
  // ==========================================

  const resumeScores = resumes
    .map((resume) => Number(resume.aiAnalysis?.atsScore || 0))
    .filter((score) => score > 0);

  const resumeAtsScore =
    resumeScores.length > 0
      ? Math.round(
          resumeScores.reduce((total, score) => total + score, 0) /
            resumeScores.length,
        )
      : 0;

  // ==========================================
  // GET COMPLETED INTERVIEWS
  // ==========================================

  const interviews = await MockInterview.find({
    userId,
    status: "completed",
  }).sort({
    completedAt: -1,
  });

  // ==========================================
  // INTERVIEW AVERAGE
  // ==========================================

  const interviewScores = interviews
    .map((interview) => Number(interview.overallScore || 0))
    .filter((score) => score > 0);

  const interviewAverage =
    interviewScores.length > 0
      ? Math.round(
          interviewScores.reduce((total, score) => total + score, 0) /
            interviewScores.length,
        )
      : 0;

  // ==========================================
  // SKILL AVERAGES
  // ==========================================

  const calculateSkillAverage = (skill) => {
    if (!interviews.length) {
      return 0;
    }

    const scores = interviews
      .map((interview) => Number(interview.skillBreakdown?.[skill] || 0))
      .filter((score) => score > 0);

    if (!scores.length) {
      return 0;
    }

    return Math.round(
      scores.reduce((total, score) => total + score, 0) / scores.length,
    );
  };

  const communication = calculateSkillAverage("communication");

  const technicalKnowledge = calculateSkillAverage("technicalKnowledge");

  const problemSolving = calculateSkillAverage("problemSolving");

  const confidence = calculateSkillAverage("confidence");

  const relevance = calculateSkillAverage("relevance");

  // ==========================================
  // EMPLOYMENT READINESS
  // ==========================================

  let employmentReadiness = 0;

  if (resumeScores.length > 0 && interviewScores.length > 0) {
    employmentReadiness = Math.round(
      resumeAtsScore * 0.5 + interviewAverage * 0.5,
    );
  } else if (resumeScores.length > 0) {
    employmentReadiness = Math.round(resumeAtsScore * 0.5);
  } else if (interviewScores.length > 0) {
    employmentReadiness = Math.round(interviewAverage * 0.5);
  }

  // ==========================================
  // READINESS LABEL
  // ==========================================

  let readinessLabel = "Not Started";

  if (employmentReadiness >= 90) {
    readinessLabel = "Excellent";
  } else if (employmentReadiness >= 75) {
    readinessLabel = "Good";
  } else if (employmentReadiness >= 50) {
    readinessLabel = "Developing";
  } else if (employmentReadiness > 0) {
    readinessLabel = "Needs Improvement";
  }

  // ==========================================
  // RESPONSE
  // ==========================================

  return {
    employmentReadiness,
    readinessLabel,

    resume: {
      completed: resumes.length,
      atsScore: resumeAtsScore,
    },

    interviews: {
      completed: interviews.length,
      averageScore: interviewAverage,
    },

    skills: {
      communication,
      technicalKnowledge,
      problemSolving,
      confidence,
      relevance,
    },
  };
};

module.exports = {
  getProgress,
};