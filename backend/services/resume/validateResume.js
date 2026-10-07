const { namesMatch } = require("./normalizeName");

const validateResume = ({ parsedResume, user }) => {
  if (!parsedResume) {
    return {
      success: false,
      valid: false,
      message: "The uploaded file could not be parsed as a resume.",
    };
  }

  if (parsedResume.isResume !== true) {
    return {
      success: false,
      valid: false,
      message: "The uploaded file is not a valid resume.",
    };
  }

  const resumeName =
    parsedResume.basicInfo?.fullName?.trim() || "";

  if (!resumeName) {
    return {
      success: false,
      valid: false,
      message: "The full name could not be found on the resume.",
    };
  }

  const userFullName =
    user.fullName ||
    [user.firstName, user.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

  if (!userFullName) {
    return {
      success: false,
      valid: false,
      message: "Your account does not have a valid full name.",
    };
  }

  const isNameMatch = namesMatch(
    userFullName,
    resumeName
  );

  if (!isNameMatch) {
    return {
      success: false,
      valid: false,
      message: "The name on the resume does not match your account name.",
    };
  }

  return {
    success: true,
    valid: true,
    message: "Resume validated successfully.",
  };
};

module.exports = validateResume;
