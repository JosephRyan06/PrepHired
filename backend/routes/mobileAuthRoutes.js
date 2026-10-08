const express = require("express");

const router = express.Router();

const {
  login,
  register,
  forgotPassword,
  verifyOtp,
  resetPassword,
  resendOtp,
  changePassword,
  deleteAccount
} = require("../controller/mobileAuthController");

const { authenticateUser } = require("../middleware/mobileAuthMiddleware");
const {
  registerLimiter,
  loginLimiter,
  forgotPasswordLimiter,
} = require("../middleware/rateLimiter");

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/resend-otp", resendOtp);
router.post("/change-password", authenticateUser, changePassword);
router.delete("/delete-account", authenticateUser, deleteAccount);


module.exports = router;
