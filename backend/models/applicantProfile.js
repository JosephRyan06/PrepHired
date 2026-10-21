
const mongoose = require("mongoose");

const applicantProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    targetJob: {
      type: String,
      required: true,
      trim: true,
    },

    targetJobKey: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    employmentReadiness: {
      score: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },

      status: {
        type: String,
        enum: ["not-assessed", "in-progress", "completed"],
        default: "not-assessed",
      },

      strengths: {
        type: [String],
        default: [],
      },

      skillGaps: {
        type: [String],
        default: [],
      },

      recommendations: {
        type: [String],
        default: [],
      },

      assessedAt: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

// One profile per user for each normalized career target.
applicantProfileSchema.index(
  { userId: 1, targetJobKey: 1 },
  { unique: true }
);

applicantProfileSchema.pre("validate", function () {
  if (this.targetJob) {
    this.targetJobKey = this.targetJob.trim().toLowerCase();
  }
});

module.exports = mongoose.model(
  "ApplicantProfile",
  applicantProfileSchema
);
