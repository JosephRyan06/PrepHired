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
  deleteAccount,
  editProfile,
  verifyEmail
} = require("../controller/mobileAuthController");

const { authenticateUser } = require("../middleware/mobileAuthMiddleware");
const {
  registerLimiter,
  loginLimiter,
  forgotPasswordLimiter,
} = require("../middleware/rateLimiter");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/resend-otp", resendOtp);
router.post("/change-password", authenticateUser, changePassword);
router.delete("/delete-account", authenticateUser, deleteAccount);
router.put("/edit-profile", authenticateUser, editProfile);

router.get("/verify-email", verifyEmail);

module.exports = router;
