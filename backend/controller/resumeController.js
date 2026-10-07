const Resume = require("../models/resume");
const User = require("../models/user");
const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");

const {
  parseImportedResume,
  generateProfessionalSummary,
  generateResumeAnalysis,
  optimizeResume: optimizeResumeAI,
} = require("../services/ai/aiService");

const validateResume = require("../services/resume/validateResume");
const { generateResumePDF } = require("../services/pdf/generateResumePDF");

// CREATE DRAFT
const createResume = async (req, res) => {
  try {
    const userId = req.user.id;

    const errors = {};

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

    const existingDraft = await Resume.findOne({
      userId,
      status: "draft",
    });

    if (existingDraft) {
      return res.status(200).json({
        success: true,
        message: "Draft resume already exists",
        resume: existingDraft,
        errors: {},
      });
    }

    const resume = await Resume.create({
      userId,
      status: "draft",
      currentStep: 1,
    });

    return res.status(201).json({
      success: true,
      message: "Draft resume created",
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Create resume error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create resume",
      errors: {},
    });
  }
};

// GET DRAFT
const getDraftResume = async (req, res) => {
  try {
    const userId = req.user.id;

    const errors = {};

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

    const resume = await Resume.findOne({
      userId,
      status: "draft",
    });

    return res.status(200).json({
      success: true,
      message: resume
        ? "Draft resume retrieved successfully"
        : "No draft resume found",
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Get draft error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get draft resume",
      errors: {},
    });
  }
};

// GET RESUME
const getResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const errors = {};

    if (!id) {
      errors.id = "Resume ID is required";
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

    const resume = await Resume.findOne({
      _id: id,
      userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
        errors: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume retrieved successfully",
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Get resume error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get resume",
      errors: {},
    });
  }
};

const importResume = async (req, res) => {
  try {
    const userId = req.user?.id;

    const errors = {};

    // =========================
    // AUTHENTICATION
    // =========================

    if (!userId) {
      errors.userId =
        "User authentication is required";
    }

    // =========================
    // FILE
    // =========================

    if (!req.file) {
      errors.resume =
        "Resume file is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const file = req.file;

    console.log(
      "========== RESUME FILE =========="
    );

    console.log(
      "Original name:",
      file.originalname
    );

    console.log(
      "Mimetype:",
      file.mimetype
    );

    console.log(
      "Size:",
      file.size
    );

    console.log(
      "Field:",
      file.fieldname
    );

    // =========================
    // FILE BUFFER
    // =========================

    if (
      !file.buffer ||
      file.buffer.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Uploaded resume file is empty.",
        errors: {
          resume:
            "The uploaded file contains no data.",
        },
      });
    }

    // =========================
    // EXTENSION
    // =========================

    const extension =
      path
        .extname(
          file.originalname || ""
        )
        .toLowerCase();

    console.log(
      "Extension:",
      extension
    );

    // =========================
    // EXTRACT TEXT
    // =========================

    let extractedText = "";

    // =========================
    // PDF
    // =========================

    if (extension === ".pdf") {
      console.log(
        "Processing PDF..."
      );

      const parser =
        new PDFParse({
          data: file.buffer,
        });

      try {
        const pdfData =
          await parser.getText();

        extractedText =
          pdfData.text || "";

        console.log(
          "PDF text extracted successfully"
        );

        console.log(
          "PDF text length:",
          extractedText.length
        );
      } finally {
        await parser.destroy();
      }
    }

    // =========================
    // DOCX
    // =========================

    else if (
      extension === ".docx"
    ) {
      console.log(
        "Processing DOCX..."
      );

      const result =
        await mammoth.extractRawText({
          buffer: file.buffer,
        });

      extractedText =
        result.value || "";

      console.log(
        "DOCX text extracted successfully"
      );
    }

    // =========================
    // DOC
    // =========================

    else if (
      extension === ".doc"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Legacy .doc files are not currently supported. Please upload PDF or DOCX.",
        errors: {},
      });
    }

    // =========================
    // INVALID FILE TYPE
    // =========================

    else {
      return res.status(400).json({
        success: false,
        message:
          "Unsupported resume file type.",
        errors: {
          resume:
            "Only PDF and DOCX files are supported.",
        },
      });
    }

    // =========================
    // CLEAN TEXT
    // =========================

    extractedText =
      extractedText.trim();

    console.log(
      "========== EXTRACTED TEXT =========="
    );

    console.log(
      extractedText
    );

    if (!extractedText) {
      return res.status(400).json({
        success: false,
        message:
          "Could not extract text from the uploaded resume.",
        errors: {
          resume:
            "The resume may be scanned or image-based.",
        },
      });
    }

    // =========================================================
    // VALIDATE EXTRACTED TEXT BEFORE AI PARSING
    // =========================================================

    console.log(
      "========== VALIDATING EXTRACTED TEXT =========="
    );

    // =========================
    // GET USER
    // =========================

    const user =
      await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Authenticated user could not be found.",
        errors: {
          userId:
            "User account not found.",
        },
      });
    }

    // =========================
    // GET USER FULL NAME
    // =========================

    const userFullName =
      user.fullName ||
      [
        user.firstName,
        user.lastName,
      ]
        .filter(Boolean)
        .join(" ")
        .trim();

    if (!userFullName) {
      return res.status(400).json({
        success: false,
        message:
          "Your account does not have a valid full name.",
        errors: {
          userId:
            "Please update your account with your full name.",
        },
      });
    }

    // =========================================================
    // NORMALIZE TEXT
    // =========================================================

    const normalizeText = (
      text = ""
    ) => {
      return text
        .toLowerCase()
        .normalize("NFKD")
        .replace(
          /[\u0300-\u036f]/g,
          ""
        )
        .replace(
          /[^a-z0-9\s]/g,
          " "
        )
        .replace(
          /\s+/g,
          " "
        )
        .trim();
    };

    const normalizedExtractedText =
      normalizeText(
        extractedText
      );

    const normalizedUserName =
      normalizeText(
        userFullName
      );

    // =========================================================
    // CHECK USER NAME IN EXTRACTED RESUME TEXT
    // =========================================================

    const userNameParts =
      normalizedUserName.split(" ");

    const hasUserName =
      userNameParts.length >= 2 &&
      userNameParts.every(
        (part) =>
          normalizedExtractedText.includes(
            part
          )
      );

    // =========================================================
    // NAME DOES NOT MATCH
    // =========================================================

  if (!hasUserName) {
    console.log(
      "========== RESUME VALIDATION FAILED =========="
    );

    console.log(
      "User Name:",
      userFullName
    );

    console.log(
      "Name Found In Resume:",
      false
    );

    return res.status(400).json({
      success: false,
      message:
        "The name on the resume does not match your account name.",
    });
  }


    // =========================================================
    // NAME VALIDATION PASSED
    // =========================================================

    console.log(
      "========== EXTRACTED TEXT VALIDATION PASSED =========="
    );

    console.log(
      "User Name:",
      userFullName
    );

    console.log(
      "Name Found In Resume:",
      true
    );

    // =========================================================
    // AI PARSE
    // =========================================================

    console.log(
      "========== AI PARSING =========="
    );

    const parsedResume =
      await parseImportedResume(
        extractedText
      );

    if (!parsedResume) {
      return res.status(400).json({
        success: false,
        message:
          "Could not parse the uploaded resume.",
        errors: {},
      });
    }

    console.log(
      "========== PARSED RESUME =========="
    );

    console.log(
      JSON.stringify(
        parsedResume,
        null,
        2
      )
    );

    if (
      parsedResume.isResume === false
    ) {
      return res.status(400).json({
        success: false,
        message:
          "The uploaded file is not a valid resume.",
        errors: {
          resume:
            "Please upload a valid resume.",
        },
      });
    }

    const resume =
      await Resume.create({
        userId,

        basicInfo:
          parsedResume.basicInfo || {
            fullName: "",
            contactNumber: "",
            address: "",
            email: "",
            linkedInURL: "",
            portfolioLink: "",
          },

        targetJob:
          parsedResume.targetJob || {
            jobTitle: "",
            industry: "",
            jobDescription: "",
          },

        workExperiences:
          parsedResume.workExperiences ||
          [],

        educations:
          parsedResume.educations ||
          [],

        professionalSummary:
          parsedResume.professionalSummary ||
          "",

        skills:
          parsedResume.skills ||
          "",

        projects:
          parsedResume.projects ||
          [],

        certificates:
          parsedResume.certificates ||
          "",

        template:
          "classic",

        currentStep:
          1,

        status:
          "draft",
      });

    console.log(
      "========== IMPORTED RESUME CREATED =========="
    );

    console.log(
      "Resume ID:",
      resume._id
    );

    // =========================================================
    // AI ANALYSIS - ORIGINAL IMPORTED RESUME
    // =========================================================

    console.log(
      "========== AI ANALYZING IMPORTED RESUME =========="
    );

    const originalAnalysis =
      await generateResumeAnalysis(
        resume
      );

    if (
      !originalAnalysis ||
      typeof originalAnalysis.atsScore !==
        "number"
    ) {
      return res.status(500).json({
        success: false,
        message:
          "AI did not return a valid original ATS score",
        errors: {},
      });
    }

    console.log(
      "Original ATS Score:",
      originalAnalysis.atsScore
    );

    // =========================
    // SAVE ORIGINAL ANALYSIS
    // =========================

    resume.aiAnalysis = {
      ...originalAnalysis,
      generatedAt:
        new Date(),
    };

    await resume.save();

    // =========================================================
    // AI OPTIMIZATION
    // =========================================================

    console.log(
      "========== AI OPTIMIZING IMPORTED RESUME =========="
    );

    const optimization =
      await optimizeResumeAI(
        resume
      );

    if (
      !optimization ||
      typeof optimization !==
        "object"
    ) {
      return res.status(500).json({
        success: false,
        message:
          "AI returned invalid resume optimization",
        errors: {},
      });
    }

    console.log(
      "========== AI OPTIMIZATION RESULT =========="
    );

    console.log(
      JSON.stringify(
        optimization,
        null,
        2
      )
    );

    // =========================================================
    // STORE OPTIMIZATION
    // =========================================================

    resume.aiOptimization = {
      address:
        optimization.address || {
          original:
            resume.basicInfo?.address ||
            "",

          optimized:
            resume.basicInfo?.address ||
            "",

          reason:
            "No address change was necessary.",
        },

      professionalSummary:
        optimization.professionalSummary || {
          original:
            resume.professionalSummary ||
            "",

          optimized:
            resume.professionalSummary ||
            "",

          reason:
            "No professional summary change was necessary.",
        },

      workExperiences:
        optimization.workExperiences ||
        [],

      educations:
        optimization.educations ||
        [],

      skills:
        optimization.skills || {
          original:
            resume.skills || "",

          optimized:
            resume.skills || "",

          reason:
            "No skills change was necessary.",
        },

      projects:
        optimization.projects ||
        [],

      certificates:
        optimization.certificates || {
          original:
            resume.certificates ||
            "",

          optimized:
            resume.certificates ||
            "",

          reason:
            "No certificate change was necessary.",
        },

      changes:
        optimization.changes ||
        [],

      generatedAt:
        new Date(),
    };

    // =========================================================
    // CREATE TEMPORARY OPTIMIZED RESUME
    // =========================================================

    const optimizedResumeData =
      resume.toObject();

    // =========================
    // ADDRESS
    // =========================

    if (
      optimization.address?.optimized !==
      undefined
    ) {
      optimizedResumeData.basicInfo =
        optimizedResumeData.basicInfo ||
        {};

      optimizedResumeData.basicInfo.address =
        optimization.address.optimized;
    }

    // =========================
    // PROFESSIONAL SUMMARY
    // =========================

    if (
      optimization.professionalSummary
        ?.optimized !== undefined
    ) {
      optimizedResumeData.professionalSummary =
        optimization.professionalSummary.optimized;
    }

    // =========================
    // SKILLS
    // =========================

    if (
      optimization.skills?.optimized !==
      undefined
    ) {
      optimizedResumeData.skills =
        optimization.skills.optimized;
    }

    // =========================
    // CERTIFICATES
    // =========================

    if (
      optimization.certificates?.optimized !==
      undefined
    ) {
      optimizedResumeData.certificates =
        optimization.certificates.optimized;
    }

    // =========================
    // WORK EXPERIENCES
    // =========================

    if (
      Array.isArray(
        optimization.workExperiences
      )
    ) {
      optimizedResumeData.workExperiences =
        optimizedResumeData.workExperiences ||
        [];

      optimization.workExperiences.forEach(
        (optimizedExperience) => {
          const index =
            optimizedResumeData.workExperiences.findIndex(
              (experience) =>
                String(
                  experience._id
                ) ===
                String(
                  optimizedExperience.id
                )
            );

          if (index === -1) {
            return;
          }

          const original =
            optimizedResumeData
              .workExperiences[index];

          const originalDescription =
            original.description
              ?.trim() || "";

          // Only optimize description
          // if the original had one.
          if (
            originalDescription &&
            optimizedExperience.description !==
              undefined
          ) {
            original.description =
              optimizedExperience.description;
          }

          // Preserve original user data.
          original.jobTitle =
            original.jobTitle;

          original.company =
            original.company;

          original.location =
            original.location;

          original.periodOfEmployment =
            original.periodOfEmployment;

          original.currentlyWorking =
            original.currentlyWorking;
        }
      );
    }

    // =========================
    // EDUCATION
    // =========================

    if (
      Array.isArray(
        optimization.educations
      )
    ) {
      optimizedResumeData.educations =
        optimizedResumeData.educations ||
        [];

      optimization.educations.forEach(
        (optimizedEducation) => {
          const index =
            optimizedResumeData.educations.findIndex(
              (education) =>
                String(
                  education._id
                ) ===
                String(
                  optimizedEducation.id
                )
            );

          if (index === -1) {
            return;
          }

          const original =
            optimizedResumeData
              .educations[index];

          const originalDescription =
            original.description
              ?.trim() || "";

          // Only optimize description
          // if the original had one.
          if (
            originalDescription &&
            optimizedEducation.description !==
              undefined
          ) {
            original.description =
              optimizedEducation.description;
          }

          // Never allow AI to change
          // the user's school year.
          original.schoolYear =
            original.schoolYear;
        }
      );
    }

    // =========================
    // PROJECTS
    // =========================

    if (
      Array.isArray(
        optimization.projects
      )
    ) {
      optimizedResumeData.projects =
        optimizedResumeData.projects ||
        [];

      optimization.projects.forEach(
        (optimizedProject) => {
          const index =
            optimizedResumeData.projects.findIndex(
              (project) =>
                String(
                  project._id
                ) ===
                String(
                  optimizedProject.id
                )
            );

          if (index === -1) {
            return;
          }

          const optimizedDescription =
            optimizedProject.optimized
              ?.trim();

          if (
            optimizedDescription
          ) {
            optimizedResumeData
              .projects[index]
              .projectDescription =
              optimizedDescription;
          }
        }
      );
    }

    // =========================================================
    // AI ANALYSIS - OPTIMIZED VERSION
    // =========================================================

    console.log(
      "========== AI ANALYZING OPTIMIZED RESUME =========="
    );

    const optimizedAnalysis =
      await generateResumeAnalysis(
        optimizedResumeData
      );

    if (
      !optimizedAnalysis ||
      typeof optimizedAnalysis.atsScore !==
        "number"
    ) {
      return res.status(500).json({
        success: false,
        message:
          "AI did not return a valid optimized ATS score",
        errors: {},
      });
    }

    console.log(
      "Optimized ATS Score:",
      optimizedAnalysis.atsScore
    );

    // =========================================================
    // SCORE IMPROVEMENT
    // =========================================================

    const originalScore =
      originalAnalysis.atsScore;

    const optimizedScore =
      optimizedAnalysis.atsScore;

    const scoreImprovement =
      optimizedScore -
      originalScore;

    // =========================================================
    // STORE OPTIMIZED ANALYSIS
    // =========================================================

    resume.aiOptimization.optimizedAnalysis =
      {
        ...optimizedAnalysis,
        generatedAt:
          new Date(),
      };

    await resume.save();

    // =========================================================
    // SUCCESS
    // =========================================================

    console.log(
      "========== IMPORT COMPLETE =========="
    );

    console.log(
      "Original ATS:",
      originalScore
    );

    console.log(
      "Optimized ATS:",
      optimizedScore
    );

    console.log(
      "Improvement:",
      scoreImprovement
    );

    return res.status(201).json({
      success: true,

      message:
        "Resume imported, analyzed, and optimized successfully",

      resume,

      originalScore,

      optimizedScore,

      scoreImprovement,

      originalAnalysis,

      optimizedAnalysis,

      optimization:
        resume.aiOptimization,

      errors: {},
    });

  } catch (error) {
    console.error(
      "Import resume error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to import resume",
      errors: {},
    });
  }
};


// STEP 1 - BASIC INFO
const saveBasicInfo = async (req, res) => {
  try {
    const {
      fullName,
      contactNumber,
      address,
      email,
      linkedInURL,
      portfolioLink,
    } = req.body;

    const errors = {};

    // Required fields
    if (!fullName?.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!contactNumber?.trim()) {
      errors.contactNumber = "Contact number is required";
    }

    if (!address?.trim()) {
      errors.address = "Address is required";
    }

    if (!email?.trim()) {
      errors.email = "Email is required";
    }

    // Full name validation
    if (fullName?.trim() && fullName.trim() !== req.user.fullName) {
      errors.fullName = "Full name does not match your account";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email?.trim() && !emailRegex.test(email.trim())) {
      errors.email = "Invalid email format";
    }

    // Contact number validation
    const phoneRegex = /^09[0-9]{9}$/;

    if (contactNumber?.trim()) {
      const value = contactNumber.trim();

      if (value.length !== 11) {
        errors.contactNumber = "Contact number must be exactly 11 digits";
      } else if (!phoneRegex.test(value)) {
        errors.contactNumber = "Contact number must start with 09";
      }
    }

    // LinkedIn URL validation
    if (linkedInURL?.trim()) {
      try {
        const url = new URL(linkedInURL.trim());

        if (url.protocol !== "http:" && url.protocol !== "https:") {
          throw new Error();
        }
      } catch {
        errors.linkedInURL = "Invalid LinkedIn URL";
      }
    }

    // Portfolio URL validation
    if (portfolioLink?.trim()) {
      try {
        const url = new URL(portfolioLink.trim());

        if (url.protocol !== "http:" && url.protocol !== "https:") {
          throw new Error();
        }
      } catch {
        errors.portfolioLink = "Invalid portfolio URL";
      }
    }

    // Return all validation errors
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
        status: "draft",
      },
      {
        $set: {
          basicInfo: {
            fullName: fullName.trim(),
            contactNumber: contactNumber.trim(),
            address: address.trim(),
            email: email.trim().toLowerCase(),
            linkedInURL: linkedInURL?.trim() || "",
            portfolioLink: portfolioLink?.trim() || "",
          },
          currentStep: 2,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Draft resume not found",
        errors: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Basic information saved",
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Save basic info error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save basic information",
      errors: {},
    });
  }
};

// STEP 2 - TARGET JOB
const saveTargetJob = async (req, res) => {
  try {
    const { jobTitle, industry, jobDescription } = req.body;

    const errors = {};

    if (!jobTitle?.trim()) {
      errors.jobTitle = "Job title is required";
    }

    if (!industry?.trim()) {
      errors.industry = "Industry is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
        status: "draft",
      },
      {
        $set: {
          targetJob: {
            jobTitle: jobTitle.trim(),
            industry: industry.trim(),
            jobDescription: jobDescription.trim() || "",
          },
          currentStep: 3,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Draft resume not found",
        errors: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Target job saved",
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Save target job error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save target job",
      errors: {},
    });
  }
};

// STEP 3 - WORK EXPERIENCE
/*
const saveWorkExperience = async (req, res) => {
  try {
    const { workExperiences, noWorkExperience } = req.body;

    const errors = {};

    if (typeof noFormalWorkExperience !== "boolean") {
      errors.noFormalWorkExperience =
        "No formal work experience must be true or false";
    }

    // Validate workExperiences
    if (!Array.isArray(workExperiences)) {
      errors.workExperiences = "Work experiences must be an array";
    }

    if (!Array.isArray(workExperiences)) {
      errors.workExperiences = "Work experiences must be an array";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
        status: "draft",
      },
      {
        $set: {
          workExperiences,
          currentStep: 4,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Draft resume not found",
        errors: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Work experience saved",
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Save work experience error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save work experience",
      errors: {},
    });
  }
};
*/
const saveWorkExperience = async (req, res) => {
  try {
    const { workExperiences, noWorkExperience } = req.body;

    const errors = {};

    // Validate noWorkExperience
    if (typeof noWorkExperience !== "boolean") {
      errors.noWorkExperience =
        "No formal work experience must be true or false";
    }

    // Validate workExperiences
    if (!Array.isArray(workExperiences)) {
      errors.workExperiences = "Work experiences must be an array";
    }

    // If checkbox is NOT checked,
    // work experience is required.
    if (noWorkExperience === false && Array.isArray(workExperiences)) {
      if (workExperiences.length === 0) {
        errors.workExperiences = "Please add at least one work experience.";
      }

      workExperiences.forEach((experience, index) => {
        if (!experience.jobTitle || !experience.jobTitle.trim()) {
          errors[`experience.${index}.jobTitle`] = "Job title is required";
        }

        if (!experience.company || !experience.company.trim()) {
          errors[`experience.${index}.company`] = "Company is required";
        }

        if (!experience.location || !experience.location.trim()) {
          errors[`experience.${index}.location`] = "Location is required";
        }

        if (
          !experience.periodOfEmployment ||
          !experience.periodOfEmployment.trim()
        ) {
          errors[`experience.${index}.periodOfEmployment`] =
            "Period of employment is required";
        }
      });
    }

    // Stop here if validation failed
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
        status: "draft",
      },
      {
        $set: {
          noWorkExperience,

          workExperiences: noWorkExperience === true ? [] : workExperiences,

          currentStep: 4,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Draft resume not found",
        errors: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Work experience saved",
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Save work experience error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save work experience",
      errors: {},
    });
  }
};

// STEP 4 - EDUCATION
const saveEducation = async (req, res) => {
  try {
    const { educations } = req.body;

    const errors = {};

    if (!Array.isArray(educations)) {
      errors.educations = "Educations must be an array";
    } else {
      // =========================
      // VALIDATE EACH EDUCATION
      // =========================

      educations.forEach((education, index) => {
        // School
        if (!education?.school?.trim()) {
          errors[`educations.${index}.school`] = "School name is required";
        }

        // Degree / Field
        if (!education?.degreeField?.trim()) {
          errors[`educations.${index}.degreeField`] =
            "Degree/field is required";
        }

        // Location
        if (!education?.location?.trim()) {
          errors[`educations.${index}.location`] = "Location is required";
        }

        // School Year
        if (!education?.schoolYear?.trim()) {
          errors[`educations.${index}.schoolYear`] = "School year is required";
        }
      });
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
        status: "draft",
      },
      {
        $set: {
          educations,
          currentStep: 5,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Draft resume not found",
        errors: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Education saved",
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Save education error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save education",
      errors: {},
    });
  }
};

// STEP 5 - SUMMARY & EXTRAS
const saveSummaryExtras = async (req, res) => {
  try {
    const { professionalSummary, skills, projects, certificates } = req.body;

    const errors = {};

    if (!professionalSummary?.trim()) {
      errors.professionalSummary = "Professional summary is required";
    }

    if (!skills?.trim()) {
      errors.skills = "Skills are required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // Get the current resume first
    const currentResume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
      status: "draft",
    });

    if (!currentResume) {
      return res.status(404).json({
        success: false,
        message: "Draft resume not found",
        errors: {},
      });
    }

    // Prepare new values
    const newProfessionalSummary = professionalSummary?.trim() || "";

    const newSkills = skills?.trim() || "";

    const newCertificates = certificates?.trim() || "";

    const newProjects = Array.isArray(projects) ? projects : [];

    // Compare old and new values
    const oldProfessionalSummary = currentResume.professionalSummary || "";

    const oldSkills = currentResume.skills || "";

    const oldCertificates = currentResume.certificates || "";

    const oldProjects = (currentResume.projects || []).map((project) => ({
      projectName: project.projectName || "",
      projectDescription: project.projectDescription || "",
    }));

    const cleanedNewProjects = newProjects.map((project) => ({
      projectName: project.projectName || "",
      projectDescription: project.projectDescription || "",
    }));

    const professionalSummaryChanged =
      oldProfessionalSummary !== newProfessionalSummary;

    const skillsChanged = oldSkills !== newSkills;

    const certificatesChanged = oldCertificates !== newCertificates;

    const projectsChanged =
      JSON.stringify(oldProjects) !== JSON.stringify(cleanedNewProjects);

    const contentChanged =
      professionalSummaryChanged ||
      skillsChanged ||
      certificatesChanged ||
      projectsChanged;

    const updateData = {
      currentStep: 6,
      professionalSummary: newProfessionalSummary,
      skills: newSkills,
      certificates: newCertificates,
      projects: newProjects,
    };

    // IMPORTANT:
    // If the resume content changed, the previous AI
    // optimization is no longer valid.
    if (contentChanged) {
      updateData.aiOptimization = null;
      updateData.aiAnalysis = null;
    }

    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
        status: "draft",
      },
      {
        $set: updateData,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Draft resume not found",
        errors: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Summary and extras saved",
      contentChanged,
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Save summary extras error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save summary and extras",
      errors: {},
    });
  }
};

// STEP 7 - CHOOSE TEMPLATE
const saveTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { template } = req.body;

    const errors = {};

    const allowedTemplates = ["classic", "modern", "professional", "minimal"];

    // Validate template
    if (!template || typeof template !== "string") {
      errors.template = "Template is required";
    } else {
      const selectedTemplate = template.trim().toLowerCase();

      if (!allowedTemplates.includes(selectedTemplate)) {
        errors.template = "Invalid template";
      }
    }

    // Return validation errors
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const selectedTemplate = template.trim().toLowerCase();

    const resume = await Resume.findOneAndUpdate(
      {
        _id: id,
        userId: req.user.id,
        status: "draft",
      },
      {
        $set: {
          template: selectedTemplate,
          currentStep: 7,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Draft resume not found",
        errors: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume template saved",
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Save template error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save resume template",
      errors: {},
    });
  }
};

// COMPLETE RESUME
const completeResume = async (req, res) => {
  try {
    const { id } = req.params;

    const errors = {};

    if (!id) {
      errors.id = "Resume ID is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const resume = await Resume.findOneAndUpdate(
      {
        _id: id,
        userId: req.user.id,
        status: "draft",
      },
      {
        $set: {
          status: "completed",
          currentStep: 8,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Draft resume not found",
        errors: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume saved successfully.",
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Complete resume error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to complete resume",
      errors: {},
    });
  }
};

// AI - GENERATE PROFESSIONAL SUMMARY
const generateSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const errors = {};

    if (!id) {
      errors.id = "Resume ID is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const resume = await Resume.findOne({
      _id: id,
      userId: req.user.id,
      status: "draft",
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Draft resume not found",
        errors: {},
      });
    }

    const summary = await generateProfessionalSummary(resume);

    resume.professionalSummary = summary;

    await resume.save();

    return res.status(200).json({
      success: true,
      message: "Professional summary generated successfully",
      summary,
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Generate summary error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate professional summary",
      errors: {},
    });
  }
};

// AI -ANALYZE RESUME
const analyzeResume = async (req, res) => {
  try {
    const { id } = req.params;

    const errors = {};

    if (!id) {
      errors.id = "Resume ID is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const resume = await Resume.findOne({
      _id: id,
      userId: req.user.id,
      status: "draft",
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Draft resume not found",
        errors: {},
      });
    }

    const analysis = await generateResumeAnalysis(resume);

    resume.aiAnalysis = {
      ...analysis,
      generatedAt: new Date(),
    };

    await resume.save();

    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      analysis: resume.aiAnalysis,
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Analyze resume error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to analyze resume",
      errors: {},
    });
  }
};

// AI - OPTIMIZE RESUME
const optimizeResume = async (req, res) => {
  try {
    const { id } = req.params;

    const errors = {};

    if (!id) {
      errors.id = "Resume ID is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const resume = await Resume.findOne({
      _id: id,
      userId: req.user.id,
      status: "draft",
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Draft resume not found",
        errors: {},
      });
    }

    const originalAnalysis = await generateResumeAnalysis(resume);

    if (!originalAnalysis || typeof originalAnalysis.atsScore !== "number") {
      return res.status(500).json({
        success: false,
        message: "AI did not return a valid original ATS score",
        errors: {},
      });
    }

    console.log("Original ATS Score:", originalAnalysis.atsScore);

    // Save original analysis
    resume.aiAnalysis = {
      ...originalAnalysis,
      generatedAt: new Date(),
    };

    await resume.save();

    const optimization = await optimizeResumeAI(resume);

    if (!optimization || typeof optimization !== "object") {
      return res.status(500).json({
        success: false,
        message: "AI returned invalid optimization",
        errors: {},
      });
    }

    resume.aiOptimization = {
      address: optimization.address || {
        original: resume.basicInfo.address || "",
        optimized: resume.basicInfo.address || "",
        reason: "No address change was necessary.",
      },

      professionalSummary: optimization.professionalSummary || {
        original: resume.professionalSummary || "",
        optimized: resume.professionalSummary || "",
        reason: "No professional summary change was necessary.",
      },

      workExperiences: optimization.workExperiences || [],

      educations: optimization.educations || [],

      skills: optimization.skills || {
        original: resume.skills || "",
        optimized: resume.skills || "",
        reason: "No skills change was necessary.",
      },

      projects: optimization.projects || [],

      certificates: optimization.certificates || {
        original: resume.certificates || "",
        optimized: resume.certificates || "",
        reason: "No certificate change was necessary.",
      },

      changes: optimization.changes || [],

      generatedAt: new Date(),
    };

    // OPTIMIZED BASIC INFO ADDRESS
    if (optimization.address?.optimized !== undefined) {
      resume.basicInfo.address = optimization.address.optimized;
    }

    if (optimization.professionalSummary?.optimized !== undefined) {
      resume.professionalSummary = optimization.professionalSummary.optimized;
    }

    /*
    if (Array.isArray(optimization.workExperiences)) {
      optimization.workExperiences.forEach((optimizedExperience) => {
        const experience = resume.workExperiences.id(optimizedExperience.id);

        if (!experience) {
          return;
        }

        if (optimizedExperience.jobTitle !== undefined) {
          experience.jobTitle = optimizedExperience.jobTitle;
        }

        if (optimizedExperience.company !== undefined) {
          experience.company = optimizedExperience.company;
        }

        if (optimizedExperience.location !== undefined) {
          experience.location = optimizedExperience.location;
        }

        if (optimizedExperience.optimized !== undefined) {
          experience.description = optimizedExperience.optimized;
        }
      });
    }
    */
   if (Array.isArray(optimization.workExperiences)) {
    optimization.workExperiences.forEach((optimizedExperience) => {
      const experience = resume.workExperiences.id(
        optimizedExperience.id
      );

      if (!experience) {
        return;
      }

      // IMPORTANT:
      // Check the ORIGINAL work experience stored in resume.workExperiences.
      const originalDescription =
        experience.description?.trim() || "";

      // Store the AI result separately.
      // DO NOT modify resume.workExperiences here.
      optimizedExperience.jobTitle =
        optimizedExperience.jobTitle ??
        experience.jobTitle;

      optimizedExperience.company =
        optimizedExperience.company ??
        experience.company;

      optimizedExperience.location =
        optimizedExperience.location ??
        experience.location;

      // NEVER allow AI to change the user's employment period.
      optimizedExperience.periodOfEmployment =
        experience.periodOfEmployment || "";

      // NEVER allow AI to change the user's currentlyWorking value.
      optimizedExperience.currentlyWorking =
        experience.currentlyWorking;

      // If user had NO original description,
      // AI optimized description MUST remain empty.
      /*
      if (!originalDescription) {
        optimizedExperience.description = "";
      }*/

      // If user DID provide a description,
      // use the AI description if provided.
      if (
        originalDescription &&
        optimizedExperience.description === undefined
      ) {
        optimizedExperience.description =
          originalDescription;
      }
    });

      // Save ONLY to aiOptimization.
      resume.aiOptimization.workExperiences =
        optimization.workExperiences;
    }


    /*
    if (Array.isArray(optimization.educations)) {
      optimization.educations.forEach((optimizedEducation) => {
        const education = resume.educations.id(optimizedEducation.id);

        if (!education) {
          return;
        }

        // AI optimized school
        if (optimizedEducation.school?.optimized !== undefined) {
          education.school = optimizedEducation.school.optimized;
        }

        // AI optimized degree/field
        if (optimizedEducation.degreeField?.optimized !== undefined) {
          education.degreeField = optimizedEducation.degreeField.optimized;
        }

        const originalDescription = education.description?.trim() || "";

        if (originalDescription) {
          if (optimizedEducation.optimized !== undefined) {
            education.description = optimizedEducation.optimized;
          }
        } else {
          // User did not provide an education description.
          // Never allow AI to add one.
          education.description = "";
        }
      });
    }
    */
    /*
    if (Array.isArray(optimization.educations)) {
      optimization.educations.forEach((optimizedEducation) => {
        const education = resume.educations.id(optimizedEducation.id);

        if (!education) {
          return;
        }

        // AI optimized school
        if (optimizedEducation.school !== undefined) {
          education.school = optimizedEducation.school;
        }

        // AI optimized degree/field
        if (optimizedEducation.degreeField !== undefined) {
          education.degreeField = optimizedEducation.degreeField;
        }

        // AI optimized location
        if (optimizedEducation.location !== undefined) {
          education.location = optimizedEducation.location;
        }

        // DO NOT CHANGE schoolYear.
        // It always stays as entered by the user.

        // Only optimize description if original description exists.
        const originalDescription = education.description?.trim() || "";

        if (originalDescription && optimizedEducation.optimized !== undefined) {
          education.description = optimizedEducation.optimized;
        } else if (!originalDescription) {
          education.description = "";
        }
      });
    }
    */
   if (Array.isArray(optimization.educations)) {
    optimization.educations.forEach((optimizedEducation) => {
      const education = resume.educations.id(
        optimizedEducation.id
      );

      if (!education) {
        return;
      }

      // IMPORTANT:
      // Check the ORIGINAL education stored in resume.educations.
      const originalDescription =
        education.description?.trim() || "";

      // Store the AI result separately.
      // DO NOT modify resume.educations here.
      optimizedEducation.school =
        optimizedEducation.school ??
        education.school;

      optimizedEducation.degreeField =
        optimizedEducation.degreeField ??
        education.degreeField;

      optimizedEducation.location =
        optimizedEducation.location ??
        education.location;

      // NEVER allow AI to change the user's schoolYear.
      optimizedEducation.schoolYear =
        education.schoolYear || "";

      // If user had NO original description,
      // AI optimized description MUST remain empty.
      
      if (!originalDescription) {
        optimizedEducation.description = "";
      }
      
      // If user DID provide a description,
      // the AI description can be stored.
      if (
        originalDescription &&
        optimizedEducation.description === undefined
      ) {
        optimizedEducation.description =
          originalDescription;
      }
    });

    // Save ONLY to aiOptimization.
    resume.aiOptimization.educations =
      optimization.educations;
  }

    if (optimization.skills?.optimized !== undefined) {
      resume.skills = optimization.skills.optimized;
    }

    /*
    if (Array.isArray(optimization.projects)) {
      optimization.projects.forEach((optimizedProject) => {
        const project = resume.projects.id(optimizedProject.id);

        if (project && optimizedProject.optimized !== undefined) {
          project.projectDescription = optimizedProject.optimized;
        }
      });
    }
    */

    if (Array.isArray(optimization.projects)) {
      optimization.projects.forEach((optimizedProject) => {
        const project = resume.projects.id(
          optimizedProject.id
        );

        if (!project) return;

        const optimizedDescription =
          optimizedProject.optimized?.trim();

        if (optimizedDescription) {
          project.projectDescription =
            optimizedDescription;
        }
      });
    }


    if (optimization.certificates?.optimized !== undefined) {
      resume.certificates = optimization.certificates.optimized;
    }

    await resume.save();

    const optimizedAnalysis = await generateResumeAnalysis(resume);

    if (!optimizedAnalysis || typeof optimizedAnalysis.atsScore !== "number") {
      return res.status(500).json({
        success: false,
        message: "AI did not return a valid optimized ATS score",
        errors: {},
      });
    }

    resume.aiOptimization.optimizedAnalysis = {
      ...optimizedAnalysis,
      generatedAt: new Date(),
    };

    const originalScore = originalAnalysis.atsScore;
    const optimizedScore = optimizedAnalysis.atsScore;
    const scoreImprovement = optimizedScore - originalScore;

    resume.currentStep = 7;

    await resume.save();

    return res.status(200).json({
      success: true,
      message: "Resume optimized successfully",

      originalScore,
      optimizedScore,
      scoreImprovement,

      originalAnalysis,
      optimizedAnalysis,

      optimization: resume.aiOptimization,

      resume,

      errors: {},
    });
  } catch (error) {
    console.error("Optimize resume error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to optimize resume",
      errors: {},
    });
  }
};

// GET COMPLETED RESUME
const getCompletedResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({
      userId: req.user.id,
      status: "completed",
    }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Completed resumes retrieved successfully",
      resumes,
      errors: {},
    });
  } catch (error) {
    console.error("Get completed resumes error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve completed resumes",
      resumes: [],
      errors: {},
    });
  }
};

// EXPORT RESUME AS PDF
const exportResumePDF = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("USER:", req.user);
    console.log("PARAMS:", req.params);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required",
      });
    }

    const resume = await Resume.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const pdf = await generateResumePDF(resume);

    const templateNames = {
      classic: "Classic",
      minimal: "Minimal",
      modern: "Modern",
      professional: "Professional",
    };

    const templateName =
      templateNames[resume.template] || "Resume";

    const fileName = `${templateName}_Resume.pdf`;
   

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Length": pdf.length,
    });

    return res.send(pdf);
  } catch (error) {
    console.error("Export resume PDF error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to export resume as PDF",
    });
  }
};

module.exports = {
  importResume,
  createResume,
  getDraftResume,
  getResume,
  //Create Resume
  saveBasicInfo,
  saveTargetJob,
  saveWorkExperience,
  saveEducation,
  generateSummary,
  saveSummaryExtras,
  analyzeResume,
  optimizeResume,
  saveTemplate,
  completeResume,
  //Export Resume
  exportResumePDF,
  //Get Resume
  getCompletedResumes,
};
