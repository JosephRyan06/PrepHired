const mongoose = require("mongoose");

const mockInterviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetJob: {
      type: String,
      required: true,
      trim: true,
    },

    interviewCategory: {
      type: String,
      enum: ["Behavioral", "Technical", "HR Screening", "All"],
      required: true,
    },

    responseMode: {
      type: String,
      enum: ["Text", "Audio"],
      default: "Text",
    },

    numberOfQuestions: {
      type: Number,
      enum: [5, 8, 12],
      required: true,
    },

    timePerQuestion: {
      type: Number,
      enum: [60, 90, 120],
      default: 60,
      required: true,
    },

    currentQuestion: {
      type: Number,
      default: 1,
    },

    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },

    questions: [
      {
        questionNumber: {
          type: Number,
          required: true,
        },

        question: {
          type: String,
          required: true,
          trim: true,
        },

        answer: {
          type: String,
          default: "",
          trim: true,
        },

        audioUrl: {
          type: String,
          default: "",
        },

        timeLimit: {
          type: Number,
          default: 60,
        },

        timeUsed: {
          type: Number,
          default: 0,
        },

        status: {
          type: String,
          enum: ["pending", "answered", "analyzed"],
          default: "pending",
        },

        score: {
          type: Number,
          min: 0,
          max: 100,
          default: 0,
        },

        contentScore: {
          type: Number,
          min: 0,
          max: 100,
          default: 0,
        },

        confidenceScore: {
          type: Number,
          min: 0,
          max: 100,
          default: 0,
        },

        naturalScore: {
          type: Number,
          min: 0,
          max: 100,
          default: 0,
        },

        feedback: {
          type: String,
          default: "",
        },

        toneAndModulation: {
          type: String,
          default: "",
        },

        wordChoiceSuggestions: [
          {
            original: {
              type: String,
              default: "",
            },

            suggestion: {
              type: String,
              default: "",
            },

            reason: {
              type: String,
              default: "",
            },
          },
        ],

        strengths: [
          {
            type: String,
          },
        ],

        improvements: [
          {
            type: String,
          },
        ],

        answeredAt: {
          type: Date,
        },

        analyzedAt: {
          type: Date,
        },
      },
    ],

    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    skillBreakdown: {
      communication: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },

      technicalKnowledge: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },

      problemSolving: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },

      confidence: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },

      relevance: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("MockInterview", mockInterviewSchema);
