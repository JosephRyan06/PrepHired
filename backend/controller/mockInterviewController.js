const MockInterview = require("../models/mockInterview");

const {
  generateInterviewQuestions,
  analyzeInterviewAnswer,
  analyzeInterviewSession,
  validateTargetJob,
} = require("../services/ai/aiService");

// ============================================================
// CREATE MOCK INTERVIEW
// ============================================================

const createMockInterview = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      targetJob,
      interviewCategory,
      responseMode,
      numberOfQuestions,
    } = req.body;

    const errors = {};

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!userId) {
      errors.userId = "User authentication is required";
    }

    if (!targetJob?.trim()) {
      errors.targetJob = "Please enter the role you are targeting.";
    } else {
      const isValidJob = await validateTargetJob({
        targetJob: targetJob.trim(),
      });

      if (!isValidJob) {
        errors.targetJob = "Please enter a valid job title.";
      }
    }

    const allowedCategories = [
      "Behavioral",
      "Technical",
      "HR Screening",
      "All",
    ];

    if (!interviewCategory) {
      errors.interviewCategory = "Interview category is required";
    } else if (!allowedCategories.includes(interviewCategory)) {
      errors.interviewCategory = "Invalid interview category";
    }

    const allowedResponseModes = ["Text", "Audio"];

    if (!responseMode) {
      errors.responseMode = "Response mode is required";
    } else if (!allowedResponseModes.includes(responseMode)) {
      errors.responseMode = "Invalid response mode";
    }

    const allowedNumberOfQuestions = [5, 8, 12, "5", "8", "12"];

    if (
      numberOfQuestions === undefined ||
      numberOfQuestions === null ||
      numberOfQuestions === ""
    ) {
      errors.numberOfQuestions = "Number of questions is required";
    } else if (!allowedNumberOfQuestions.includes(numberOfQuestions)) {
      errors.numberOfQuestions = "Invalid number of questions";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const questionCount = Number(numberOfQuestions);

    // -----------------------------
    // GENERATE QUESTIONS
    // -----------------------------

    const questions = await generateInterviewQuestions({
      targetJob: targetJob.trim(),
      interviewCategory,
      numberOfQuestions: questionCount,
    });

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(500).json({
        success: false,
        message: "AI did not return valid interview questions",
        errors: {},
      });
    }

    // -----------------------------
    // FORMAT QUESTIONS
    // -----------------------------

    const formattedQuestions = questions.map((question, index) => ({
      questionNumber: index + 1,

      question:
        typeof question === "string"
          ? question
          : question.question || "",

      answer: "",

      audioUrl: "",

      timeLimit: 60,

      timeUsed: 0,

      status: "pending",
    }));

    // -----------------------------
    // CREATE INTERVIEW
    // -----------------------------

    const mockInterview = await MockInterview.create({
      userId,

      targetJob: targetJob.trim(),

      interviewCategory,

      responseMode,

      numberOfQuestions: questionCount,

      currentQuestion: 1,

      status: "in-progress",

      questions: formattedQuestions,

      startedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Mock interview created successfully",
      mockInterview,
      errors: {},
    });
  } catch (error) {
    console.error("Create mock interview error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create mock interview",
      errors: {},
    });
  }
};

// ============================================================
// GET MOCK INTERVIEW
// ============================================================

const getMockInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const errors = {};

    if (!id) {
      errors.id = "Mock interview ID is required";
    }

    if (!userId) {
      errors.userId = "User authentication is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const mockInterview = await MockInterview.findOne({
      _id: id,
      userId,
    });

    if (!mockInterview) {
      return res.status(404).json({
        success: false,
        message: "Mock interview not found",
        errors: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Mock interview retrieved successfully",
      mockInterview,
      errors: {},
    });
  } catch (error) {
    console.error("Get mock interview error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get mock interview",
      errors: {},
    });
  }
};

// ============================================================
// SAVE INTERVIEW ANSWER
// ============================================================

const saveInterviewAnswer = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      questionNumber,
      answer,
      audioUrl,
      timeUsed,
    } = req.body;

    const errors = {};

    if (!id) {
      errors.id = "Mock interview ID is required";
    }

    if (
      questionNumber === undefined ||
      questionNumber === null ||
      questionNumber === ""
    ) {
      errors.questionNumber =
        "Question number is required";
    }

    if (answer === undefined || answer === null) {
      errors.answer = "Answer is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const mockInterview =
      await MockInterview.findOne({
        _id: id,
        userId: req.user.id,
      });

    if (!mockInterview) {
      return res.status(404).json({
        success: false,
        message: "Mock interview not found",
        errors: {},
      });
    }

    // Once completed, don't allow a new answer.
    if (mockInterview.status !== "in-progress") {
      return res.status(409).json({
        success: false,
        message: "Mock interview has already been completed",
        errors: {},
      });
    }

    const number = Number(questionNumber);

    if (!Number.isInteger(number) || number < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid question number",
        errors: {},
      });
    }

    const question =
      mockInterview.questions.find(
        (item) =>
          Number(item.questionNumber) === number,
      );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Interview question not found",
        errors: {},
      });
    }

    question.answer =
      typeof answer === "string"
        ? answer.trim()
        : "";

    if (audioUrl !== undefined) {
      question.audioUrl = audioUrl;
    }

    if (timeUsed !== undefined) {
      const parsedTimeUsed = Number(timeUsed);

      if (Number.isFinite(parsedTimeUsed)) {
        question.timeUsed = Math.max(
          parsedTimeUsed,
          0,
        );
      }
    }

    question.status = "answered";
    question.answeredAt = new Date();

    if (
      number >= mockInterview.currentQuestion
    ) {
      mockInterview.currentQuestion = Math.min(
        number + 1,
        mockInterview.numberOfQuestions,
      );
    }

    await mockInterview.save();

    return res.status(200).json({
      success: true,
      message: "Interview answer saved successfully",
      mockInterview,
      errors: {},
    });
  } catch (error) {
    console.error(
      "Save interview answer error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to save interview answer",
      errors: {},
    });
  }
};


// ============================================================
// ANALYZE ONE INTERVIEW ANSWER
// ============================================================

const analyzeAnswer = async (req, res) => {
  try {
    const { id } = req.params;

    const { questionNumber } = req.body;

    const errors = {};


    if (!id) {
      errors.id = "Mock interview ID is required";
    }

    if (
      questionNumber === undefined ||
      questionNumber === null ||
      questionNumber === ""
    ) {
      errors.questionNumber =
        "Question number is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // -----------------------------
    // IMPORTANT:
    // DO NOT CHECK STATUS HERE.
    //
    // Both in-progress and completed
    // interviews can have answers
    // analyzed.
    // -----------------------------

    const mockInterview =
      await MockInterview.findOne({
        _id: id,
        userId: req.user.id,
      });

    if (!mockInterview) {
      return res.status(404).json({
        success: false,
        message: "Mock interview not found",
        errors: {},
      });
    }

    // -----------------------------
    // FIND QUESTION
    // -----------------------------

    const number = Number(questionNumber);

    if (!Number.isInteger(number) || number < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid question number",
        errors: {},
      });
    }

    const question =
      mockInterview.questions.find(
        (item) =>
          Number(item.questionNumber) === number,
      );

    if (!question) {
      return res.status(404).json({
        success: false,
        message:
          "Interview question not found",
        errors: {},
      });
    }

    // -----------------------------
    // VALIDATE ANSWER
    // -----------------------------

    if (
      typeof question.answer !== "string" ||
      !question.answer.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Interview answer is required",
        errors: {},
      });
    }

    // -----------------------------
    // NORMALIZE SCORE
    // -----------------------------

    const normalizeScore = (value) => {
      const number = Number(value);

      if (!Number.isFinite(number)) {
        return 0;
      }

      return Math.min(
        Math.max(Math.round(number), 0),
        100,
      );
    };

    // -----------------------------
    // CALL AI
    // -----------------------------

    const analysis =
      await analyzeInterviewAnswer({
        targetJob:
          mockInterview.targetJob,

        interviewCategory:
          mockInterview.interviewCategory,

        question:
          question.question,

        answer:
          question.answer,

        responseMode:
          mockInterview.responseMode ||
          "Text",
      });

    // -----------------------------
    // VALIDATE AI RESPONSE
    // -----------------------------

    if (
      !analysis ||
      typeof analysis !== "object"
    ) {
      return res.status(500).json({
        success: false,
        message:
          "AI returned invalid answer analysis",
        errors: {},
      });
    }

    // -----------------------------
    // SAVE ANALYSIS
    // -----------------------------

    question.score =
      normalizeScore(analysis.score);

    question.contentScore =
      normalizeScore(
        analysis.contentScore,
      );

    question.confidenceScore =
      normalizeScore(
        analysis.confidenceScore,
      );

    question.naturalScore =
      normalizeScore(
        analysis.naturalScore,
      );

    question.feedback =
      typeof analysis.feedback === "string"
        ? analysis.feedback
        : "";

    question.toneAndModulation =
      typeof analysis.toneAndModulation ===
      "string"
        ? analysis.toneAndModulation
        : "";

    question.wordChoiceSuggestions =
      Array.isArray(
        analysis.wordChoiceSuggestions,
      )
        ? analysis.wordChoiceSuggestions
            .filter(
              (item) =>
                item &&
                typeof item === "object",
            )
            .map((item) => ({
              original:
                typeof item.original ===
                "string"
                  ? item.original
                  : "",

              suggestion:
                typeof item.suggestion ===
                "string"
                  ? item.suggestion
                  : "",

              reason:
                typeof item.reason ===
                "string"
                  ? item.reason
                  : "",
            }))
        : [];

    question.strengths =
      Array.isArray(analysis.strengths)
        ? analysis.strengths.filter(
            (item) =>
              typeof item === "string",
          )
        : [];

    question.improvements =
      Array.isArray(
        analysis.improvements,
      )
        ? analysis.improvements.filter(
            (item) =>
              typeof item === "string",
          )
        : [];

    question.status = "analyzed";

    question.analyzedAt = new Date();

    await mockInterview.save();

    return res.status(200).json({
      success: true,

      message:
        "Interview answer analyzed successfully",

      analysis: {
        score: question.score,

        contentScore:
          question.contentScore,

        confidenceScore:
          question.confidenceScore,

        naturalScore:
          question.naturalScore,

        feedback:
          question.feedback,

        toneAndModulation:
          question.toneAndModulation,

        wordChoiceSuggestions:
          question.wordChoiceSuggestions,

        strengths:
          question.strengths,

        improvements:
          question.improvements,
      },

      question,

      errors: {},
    });
  } catch (error) {
    console.error(
      "Analyze interview answer error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to analyze interview answer",
      errors: {},
    });
  }
};

// ============================================================
// ANALYZE COMPLETE SESSION
//
// IMPORTANT:
// This endpoint is NOT called by
// completeMockInterview.
//
// It is a separate operation that can
// be called later when the results page
// needs overall analysis.
// ============================================================

const analyzeSession = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Mock interview ID is required",
        errors: {},
      });
    }

    const mockInterview =
      await MockInterview.findOne({
        _id: id,
        userId: req.user.id,
      });

    if (!mockInterview) {
      return res.status(404).json({
        success: false,
        message: "Mock interview not found",
        errors: {},
      });
    }

    // -----------------------------
    // CHECK THAT QUESTIONS HAVE
    // ANSWERS / ANALYSIS
    // -----------------------------

    const answeredQuestions =
      mockInterview.questions.filter(
        (question) =>
          typeof question.answer ===
            "string" &&
          question.answer.trim(),
      );

    if (answeredQuestions.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "No interview answers are available for session analysis",
        errors: {},
      });
    }

    // -----------------------------
    // CALL AI
    // -----------------------------

    const analysis =
      await analyzeInterviewSession({
        targetJob:
          mockInterview.targetJob,

        interviewCategory:
          mockInterview.interviewCategory,

        questions:
          mockInterview.questions,
      });

    if (
      !analysis ||
      typeof analysis !== "object"
    ) {
      return res.status(500).json({
        success: false,
        message:
          "AI returned invalid session analysis",
        errors: {},
      });
    }

    // -----------------------------
    // NORMALIZE SESSION SCORES
    // -----------------------------

    const normalizeScore = (value) => {
      const number = Number(value);

      if (!Number.isFinite(number)) {
        return 0;
      }

      return Math.min(
        Math.max(Math.round(number), 0),
        100,
      );
    };

    mockInterview.overallScore =
      normalizeScore(
        analysis.overallScore,
      );

    const skillBreakdown =
      analysis.skillBreakdown || {};

    mockInterview.skillBreakdown = {
      communication:
        normalizeScore(
          skillBreakdown.communication,
        ),

      technicalKnowledge:
        normalizeScore(
          skillBreakdown.technicalKnowledge,
        ),

      problemSolving:
        normalizeScore(
          skillBreakdown.problemSolving,
        ),

      confidence:
        normalizeScore(
          skillBreakdown.confidence,
        ),

      relevance:
        normalizeScore(
          skillBreakdown.relevance,
        ),
    };

    await mockInterview.save();

    return res.status(200).json({
      success: true,

      message:
        "Interview session analyzed successfully",

      analysis: {
        overallScore:
          mockInterview.overallScore,

        skillBreakdown:
          mockInterview.skillBreakdown,
      },

      mockInterview,

      errors: {},
    });
  } catch (error) {
    console.error(
      "Analyze interview session error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to analyze interview session",
      errors: {},
    });
  }
};

// ============================================================
// COMPLETE MOCK INTERVIEW
//
// IMPORTANT:
// THIS ONLY COMPLETES THE SESSION.
//
// It does NOT call analyzeSession().
// ============================================================

const completeMockInterview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Mock interview ID is required",
        errors: {},
      });
    }

    const mockInterview =
      await MockInterview.findOne({
        _id: id,
        userId: req.user.id,
      });

    if (!mockInterview) {
      return res.status(404).json({
        success: false,
        message: "Mock interview not found",
        errors: {},
      });
    }

    // Already completed.
    // Do NOT treat this as an error.
    if (mockInterview.status === "completed") {
      return res.status(200).json({
        success: true,
        message: "Mock interview already completed",
        mockInterview,
        errors: {},
      });
    }

    mockInterview.status = "completed";
    mockInterview.completedAt = new Date();

    await mockInterview.save();

    return res.status(200).json({
      success: true,
      message: "Mock interview completed successfully",
      mockInterview,
      errors: {},
    });
  } catch (error) {
    console.error(
      "Complete mock interview error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to complete mock interview",
      errors: {},
    });
  }
};

// ============================================================
// GET COMPLETED MOCK INTERVIEWS
// ============================================================

const getCompletedMockInterviews = async (
  req,
  res,
) => {
  try {
    const mockInterviews =
      await MockInterview.find({
        userId: req.user.id,
        status: "completed",
      }).sort({
        updatedAt: -1,
      });

    return res.status(200).json({
      success: true,

      message:
        "Completed mock interviews retrieved successfully",

      mockInterviews,

      errors: {},
    });
  } catch (error) {
    console.error(
      "Get completed mock interviews error:",
      error,
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to retrieve completed mock interviews",

      mockInterviews: [],

      errors: {},
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  createMockInterview,
  getMockInterview,
  saveInterviewAnswer,
  analyzeAnswer,
  analyzeSession,
  completeMockInterview,
  getCompletedMockInterviews,
};
