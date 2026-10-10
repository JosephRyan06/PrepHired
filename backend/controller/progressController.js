const progressService = require("../services/progressService");

const getProgress = async (req, res) => {
  try {
    const progress = await progressService.getProgress(req.user.id);

    return res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error("Get progress error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get progress",
    });
  }
};

module.exports = {
  getProgress,
};
