const mongoose = require("mongoose");

const workExperienceSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      trim: true,
      default: "",
    },

    company: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    periodOfEmployment: {
      type: String,
      trim: true,
      default: "",
    },

    currentlyWorking: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: true },
);

const educationSchema = new mongoose.Schema(
  {
    school: {
      type: String,
      trim: true,
      default: "",
    },

    degreeField: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    schoolYear: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: true },
);

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      trim: true,
      default: "",
    },

    projectDescription: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: true },
);

const aiAnalysisSchema = new mongoose.Schema(
  {
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    strengths: {
      type: [String],
      default: [],
    },

    missingKeywords: {
      type: [String],
      default: [],
    },

    matchingKeywords: {
      type: [String],
      default: [],
    },

    recommendations: {
      type: [String],
      default: [],
    },

    experienceAnalysis: {
      type: String,
      trim: true,
      default: "",
    },

    educationAnalysis: {
      type: String,
      trim: true,
      default: "",
    },

    skillsAnalysis: {
      type: String,
      trim: true,
      default: "",
    },

    projectAnalysis: {
      type: String,
      trim: true,
      default: "",
    },

    certificateAnalysis: {
      type: String,
      trim: true,
      default: "",
    },

    generatedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false },
);

const optimizationTextSchema = new mongoose.Schema(
  {
    original: {
      type: String,
      trim: true,
      default: "",
    },

    optimized: {
      type: String,
      trim: true,
      default: "",
    },

    reason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false },
);

/*
const optimizedWorkExperienceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "",
    },

    jobTitle: {
      type: String,
      trim: true,
      default: "",
    },

    company: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    original: {
      type: String,
      trim: true,
      default: "",
    },

    optimized: {
      type: String,
      trim: true,
      default: "",
    },

    reason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false },
);
*/

const optimizedWorkExperienceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "",
    },

    jobTitle: {
      type: String,
      trim: true,
      default: "",
    },

    company: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    periodOfEmployment: {
      type: String,
      trim: true,
      default: "",
    },

    currentlyWorking: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    reason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false },
);

/*
const optimizedEducationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "",
    },

    school: {
      type: String,
      trim: true,
      default: "",
    },

    degreeField: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    schoolYear: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    reason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false },
);
*/

const optimizedEducationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "",
    },

    school: {
      type: String,
      trim: true,
      default: "",
    },

    degreeField: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    schoolYear: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    reason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false },
);

const optimizedProjectSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "",
    },

    projectName: {
      type: String,
      trim: true,
      default: "",
    },

    projectDescription: {
      type: String,
      trim: true,
      default: "",
    },

    reason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false },
);

const optimizedAddressSchema = new mongoose.Schema(
  {
    original: {
      type: String,
      trim: true,
      default: "",
    },

    optimized: {
      type: String,
      trim: true,
      default: "",
    },

    reason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false },
);

const aiOptimizationSchema = new mongoose.Schema(
  {
    address: {
      type: optimizedAddressSchema,
      default: () => ({}),
    },

    professionalSummary: {
      type: optimizationTextSchema,
      default: () => ({}),
    },

    workExperiences: {
      type: [optimizedWorkExperienceSchema],
      default: [],
    },

    educations: {
      type: [optimizedEducationSchema],
      default: [],
    },

    skills: {
      type: optimizationTextSchema,
      default: () => ({}),
    },

    projects: {
      type: [optimizedProjectSchema],
      default: [],
    },

    certificates: {
      type: optimizationTextSchema,
      default: () => ({}),
    },

    changes: {
      type: [String],
      default: [],
    },

    optimizedAnalysis: {
      type: aiAnalysisSchema,
      default: null,
    },

    generatedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false },
);

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    basicInfo: {
      firstName: {
        type: String,
        trim: true,
        default: "",
      },

      lastName: {
        type: String,
        trim: true,
        default: "",
      },

      fullName: {
        type: String,
        trim: true,
        default: "",
      },

      contactNumber: {
        type: String,
        trim: true,
        default: "",
      },

      address: {
        type: String,
        trim: true,
        default: "",
      },

      email: {
        type: String,
        trim: true,
        lowercase: true,
        default: "",
      },

      linkedInURL: {
        type: String,
        trim: true,
        default: "",
      },

      portfolioLink: {
        type: String,
        trim: true,
        default: "",
      },
    },

    targetJob: {
      jobTitle: {
        type: String,
        trim: true,
        default: "",
      },

      industry: {
        type: String,
        trim: true,
        default: "",
      },

      jobDescription: {
        type: String,
        trim: true,
        default: "",
      },
    },

    workExperiences: {
      type: [workExperienceSchema],
      default: [],
    },

    noWorkExperience: {
      type: Boolean,
      default: false,
    },

    educations: {
      type: [educationSchema],
      default: [],
    },

    professionalSummary: {
      type: String,
      trim: true,
      default: "",
    },

    skills: {
      type: String,
      trim: true,
      default: "",
    },

    projects: {
      type: [projectSchema],
      default: [],
    },

    certificates: {
      type: String,
      trim: true,
      default: "",
    },

    aiAnalysis: {
      type: aiAnalysisSchema,
      default: () => ({}),
    },

    aiOptimization: {
      type: aiOptimizationSchema,
      default: null,
    },

    template: {
      type: String,

      enum: ["classic", "modern", "professional", "minimal"],

      default: "classic",
    },

    pdfUrl: {
      type: String,
      trim: true,
      default: "",
    },

    currentStep: {
      type: Number,
      min: 1,
      max: 8,
      default: 1,
    },

    status: {
      type: String,

      enum: ["draft", "completed"],

      default: "draft",
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Resume", resumeSchema);
