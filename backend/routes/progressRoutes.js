const express = require("express");
const router = express.Router();

const {
  getProgress,
} = require("../controller/progressController");

const { authenticateUser } = require("../middleware/mobileAuthMiddleware");

router.get(
  "/",
  authenticateUser,
  getProgress
);

module.exports = router;
