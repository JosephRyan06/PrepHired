
const mongoose = require("mongoose");
const ApplicantProfile = require("../models/applicantProfile");
const Resume = require("../models/resume");
const MockInterview = require("../models/mockInterview");

const createApplicantProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetJob } = req.body;

    if (typeof targetJob !== "string" || !targetJob.trim()) {
      return res.status(400).json({
        success: false,
        message: "Target job is required",
      });
    }

    const normalizedTargetJob = targetJob.trim().toLowerCase();

    const profile = await ApplicantProfile.findOneAndUpdate(
      {
        userId,
        targetJobKey: normalizedTargetJob,
      },
      {
        $setOnInsert: {
          userId,
          targetJob: targetJob.trim(),
          targetJobKey: normalizedTargetJob,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Applicant profile created or retrieved successfully",
      data: profile,
    });
  } catch (error) {
    console.error("Create applicant profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create applicant profile",
    });
  }
};

const getApplicantProfiles = async (req, res) => {
  try {
    const profiles = await ApplicantProfile.find({
      userId: req.user.id,
    }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles,
    });
  } catch (error) {
    console.error("Get applicant profiles error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get applicant profiles",
    });
  }
};

const getApplicantProfileById = async (req, res) => {
  try {
    const { profileId } = req.params;

    if (!mongoose.isValidObjectId(profileId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid applicant profile ID",
      });
    }

    const profile = await ApplicantProfile.findOne({
      _id: profileId,
      userId: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Applicant profile not found",
      });
    }

    const [resumes, mockInterviews] = await Promise.all([
      Resume.find({
        userId: req.user.id,
        applicantProfileId: profile._id,
      }).sort({ updatedAt: -1 }),

      MockInterview.find({
        userId: req.user.id,
        applicantProfileId: profile._id,
      }).sort({ updatedAt: -1 }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        profile,
        resumes,
        mockInterviews,
      },
    });
  } catch (error) {
    console.error("Get applicant profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get applicant profile",
    });
  }
};

const updateEmploymentReadiness = async (req, res) => {
  try {
    const { profileId } = req.params;
    const {
      score,
      status,
      strengths,
      skillGaps,
      recommendations,
    } = req.body;

    if (!mongoose.isValidObjectId(profileId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid applicant profile ID",
      });
    }

    const profile = await ApplicantProfile.findOne({
      _id: profileId,
      userId: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Applicant profile not found",
      });
    }

    const readiness = profile.employmentReadiness;

    if (score !== undefined) {
      if (
        typeof score !== "number" ||
        !Number.isFinite(score) ||
        score < 0 ||
        score > 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Score must be between 0 and 100",
        });
      }

      readiness.score = score;
    }

    if (status !== undefined) {
      if (
        !["not-assessed", "in-progress", "completed"].includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid employment readiness status",
        });
      }

      readiness.status = status;
    }

    for (const [field, value] of [
      ["strengths", strengths],
      ["skillGaps", skillGaps],
      ["recommendations", recommendations],
    ]) {
      if (value !== undefined) {
        if (
          !Array.isArray(value) ||
          !value.every((item) => typeof item === "string")
        ) {
          return res.status(400).json({
            success: false,
            message: `${field} must be an array of strings`,
          });
        }

        readiness[field] = value;
      }
    }

    readiness.assessedAt = new Date();

    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Employment readiness updated successfully",
      data: profile,
    });
  } catch (error) {
    console.error("Update employment readiness error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update employment readiness",
    });
  }
};

const deleteApplicantProfile = async (req, res) => {
  try {
    const { profileId } = req.params;

    if (!mongoose.isValidObjectId(profileId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid applicant profile ID",
      });
    }

    const profile = await ApplicantProfile.findOne({
      _id: profileId,
      userId: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Applicant profile not found",
      });
    }

    // Delete only the records linked to this career profile.
    await Promise.all([
      Resume.deleteMany({
        userId: req.user.id,
        applicantProfileId: profile._id,
      }),

      MockInterview.deleteMany({
        userId: req.user.id,
        applicantProfileId: profile._id,
      }),
    ]);

    await profile.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Applicant profile deleted successfully",
      data: {
        profileId: profile._id,
      },
    });
  } catch (error) {
    console.error("Delete applicant profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete applicant profile",
    });
  }
};

module.exports = {
  createApplicantProfile,
  getApplicantProfiles,
  getApplicantProfileById,
  updateEmploymentReadiness,
  deleteApplicantProfile,
};
