
const Resume = require("../models/resume");
const MockInterview = require("../models/mockInterview");
const ApplicantProfile = require("../models/applicantProfile");

const normalizeJob = (job = "") =>
  job.trim().toLowerCase().replace(/\s+/g, " ");

const syncApplicantProfile = async (userId, targetJob) => {
  const targetJobKey = normalizeJob(targetJob);

  if (!userId || !targetJobKey) {
    return null;
  }

  // Find a resume for this target job.
  const resume = await Resume.findOne({
    userId,
    "targetJob.jobTitle": {
      $exists: true,
      $ne: "",
    },
  });

  // Find a resume whose target job matches.
  const matchingResume = resume &&
    normalizeJob(resume.targetJob?.jobTitle || "") === targetJobKey
      ? resume
      : await Resume.findOne({
          userId,
          "targetJob.jobTitle": {
            $regex: new RegExp(
              `^${targetJobKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
              "i"
            ),
          },
        });

  // Check for a mock interview for the same target job.
  const interviews = await MockInterview.find({
    userId,
  }).select("targetJob");

  const matchingInterview = interviews.find(
    (interview) =>
      normalizeJob(interview.targetJob || "") === targetJobKey
  );

  // Create a profile if EITHER resource exists.
  if (!matchingResume && !matchingInterview) {
    return null;
  }

  const profileTargetJob =
    matchingResume?.targetJob?.jobTitle?.trim() ||
    matchingInterview?.targetJob?.trim();

  return ApplicantProfile.findOneAndUpdate(
    {
      userId,
      targetJobKey,
    },
    {
      $setOnInsert: {
        userId,
        targetJob: profileTargetJob,
        targetJobKey,
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    }
  );
};

module.exports = syncApplicantProfile;
