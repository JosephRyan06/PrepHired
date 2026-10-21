const { mongoose } = require("../../../backend/thirduserDependencies");

const progressRecommendationSchema = new mongoose.Schema(
  {
    counselorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    details: { type: String, trim: true, maxlength: 2000, default: "" },
    category: {
      type: String,
      enum: ["resume", "skill", "interview", "career", "other"],
      default: "other",
    },
    status: {
      type: String,
      enum: ["open", "completed"],
      default: "open",
    },
    dueAt: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  "ProgressRecommendation",
  progressRecommendationSchema,
);