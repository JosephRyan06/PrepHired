const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Resume = require("../models/resume");
const MockInterview = require("../models/mockInterview");

const { sendPasswordResetOtp } = require("../services/emailService");

const register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, termsAccepted } =
      req.body;

    const role = "user";
    const errors = {};

    // Required fields
    if (!fullName) {
      errors.fullName = "Full name is required";
    }

    if (!email) {
      errors.email = "Email is required";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    if (!termsAccepted) {
      errors.termsCondition = "You must agree to the Terms and Conditions";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    }

    // Full name validation
    if (fullName && /\d/.test(fullName)) {
      errors.fullName = "Name must not contain numbers";
    }

    // Email validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }

    if (password && password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (password && password.length > 16) {
      errors.password = "Password must not exceed 16 characters";
    } else if (password && /\s/.test(password)) {
      errors.password = "Password must not contain spaces";
    } else if (password && !/[A-Z]/.test(password)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (password && !/[0-9]/.test(password)) {
      errors.password = "Password must contain at least one number";
    } else if (password && !/[^A-Za-z0-9\s]/.test(password)) {
      errors.password = "Password must contain at least one special character";
    }

    // Confirm password
    if (password && confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Return validation errors
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // Check existing email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Registration failed",
        errors: {
          email: "Email already exists",
        },
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      isEnabled: true,
      termsAccepted,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isEnabled: user.isEnabled,
        termsAccepted: user.termsAccepted,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const errors = {};

    // Required fields
    if (!email) {
      errors.email = "Email is required";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }

    // Return validation errors
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Login failed",
        errors: {
          password: "Incorrect password",
        },
      });
    }

    // Check if account is disabled
    if (!user.isEnabled) {
      return res.status(403).json({
        success: false,
        message: "Login failed",
        errors: {
          general: "Your account has been disabled",
        },
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Login failed",
        errors: {
          general: "Admin accounts cannot log in here",
        },
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Login failed",
        errors: {
          password: "Incorrect password",
        },
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    // Successful login
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isEnabled: user.isEnabled,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const errors = {};

    if (!email) {
      errors.email = "Email is required";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "Verification code has been sent.",
        errors: {},
      });
    }

    // Check account status
    if (!user.isEnabled) {
      return res.status(200).json({
        success: true,
        message: "Verification code has been sent.",
        errors: {},
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    // Hash OTP
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    // OTP expiration
    // 10 minutes
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP information
    user.resetOtpHash = otpHash;

    user.resetOtpExpires = otpExpires;

    user.resetOtpAttempts = 0;

    // Remove any previous reset token
    user.resetTokenHash = null;

    user.resetTokenExpires = null;

    await user.save();

    // Send OTP through Gmail
    await sendPasswordResetOtp(user.email, otp);

    // Response
    return res.status(200).json({
      success: true,
      message: "Verification code has been sent.",
      errors: {},
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process password reset request",
      errors: {},
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const errors = {};

    if (!email) {
      errors.email = "Email is required";
    }

    if (!otp) {
      errors.otp = "Verification code is required";
    }

    if (otp && !/^\d{6}$/.test(otp)) {
      errors.otp = "Verification code must be 6 digits";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: {},
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    //find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification code",
        errors: {
          otp: "Invalid or expired verification code",
        },
      });
    }

    // Check attempt limit
    if (user.resetOtpAttempts >= 5) {
      user.resetOtpHash = null;

      user.resetOtpExpires = null;

      user.resetOtpAttempts = 0;

      await user.save();

      return res.status(429).json({
        success: false,
        message: "Too many OTP attempts. Please request a new code.",
        errors: {
          otp: "Too many attempts. Please request a new code.",
        },
      });
    }

    // Check OTP exists
    if (!user.resetOtpHash) {
      return res.status(400).json({
        success: false,
        message: "No verification code found",
        errors: {
          otp: "Please request a new verification code.",
        },
      });
    }

    // Check expiration
    if (!user.resetOtpExpires || user.resetOtpExpires < new Date()) {
      user.resetOtpHash = null;

      user.resetOtpExpires = null;

      user.resetOtpAttempts = 0;

      await user.save();

      return res.status(400).json({
        sucess: false,
        message: "Verification code expired",
        errors: {
          otp: "This verification code has expired. Please request a new one.",
        },
      });
    }

    // Hash submitted OTP
    const submittedOtpHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    // Compare OTP
    if (submittedOtpHash !== user.resetOtpHash) {
      user.resetOtpAttempts += 1;

      await user.save();

      const remainingAttempts = 5 - user.resetOtpAttempts;

      return res.status(400).json({
        sucess: false,
        message: "Incorrect verification code.",

        errors: {
          otp:
            remainingAttempts > 0
              ? `Invalid verification code. ${remainingAttempts} attempts remaining.`
              : "Too many attempts. Please request a new code.",
        },
      });
    }

    // OTP IS CORRECT
    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash reset token before storing
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Reset token expires in 10 minutes
    const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Remove OTP
    user.resetOtpHash = null;

    user.resetOtpExpires = null;

    user.resetOtpAttempts = 0;

    // Save reset token
    user.resetTokenHash = resetTokenHash;

    user.resetTokenExpires = resetTokenExpires;

    await user.save();

    // Send reset token to mobile app
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",

      resetToken,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify verification code",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { resetToken, password, confirmPassword } = req.body;

    const errors = {};

    // Validation
    if (!resetToken) {
      return res.status(400).json({
        message: "Password reset authorization is required",
      });
    }

    if (!password) {
      errors.password = "Password is required";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    }

    if (password && password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (password && password.length > 16) {
      errors.password = "Password must not exceed 16 characters";
    } else if (password && /\s/.test(password)) {
      errors.password = "Password must not contain spaces";
    } else if (password && !/[A-Z]/.test(password)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (password && !/[0-9]/.test(password)) {
      errors.password = "Password must contain at least one number";
    } else if (password && !/[^A-Za-z0-9\s]/.test(password)) {
      errors.password = "Password must contain at least one special character";
    }

    if (password && confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // Hash reset token
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Find user
    const user = await User.findOne({
      resetTokenHash,
      resetTokenExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset session",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    user.password = hashedPassword;

    // Destroy reset token
    user.resetTokenHash = null;

    user.resetTokenExpires = null;

    // Make sure OTP information is also removed
    user.resetOtpHash = null;

    user.resetOtpExpires = null;

    user.resetOtpAttempts = 0;

    await user.save();

    // Success
    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      sucess: false,
      message: "Unable to reset password",
    });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const errors = {};

    // Validate email
    if (!email) {
      errors.email = "Email is required";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    // Don't reveal whether email exists
    if (!user || !user.isEnabled) {
      return res.status(200).json({
        success: true,
        message: "Verification code has been sent.",
        errors: {},
      });
    }

    if (
      user.resetOtpHash &&
      user.resetOtpExpires &&
      new Date(user.resetOtpExpires) > new Date()
    ) {
      return res.status(200).json({
        success: true,
        message: "Your current verification code is still valid.",
        errors: {},
      });
    }

    // Generate new 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Hash OTP
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    // OTP expires in 10 minutes
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Replace old OTP
    user.resetOtpHash = otpHash;
    user.resetOtpExpires = otpExpires;
    user.resetOtpAttempts = 0;

    // Remove previous reset token
    user.resetTokenHash = null;
    user.resetTokenExpires = null;

    await user.save();

    // Send new OTP
    await sendPasswordResetOtp(user.email, otp);

    return res.status(200).json({
      success: true,
      message: "Verification code has been resent.",
      errors: {},
    });
  } catch (error) {
    console.error("Resend OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to resend verification code",
      errors: {},
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const errors = {};

    if (!currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!newPassword) {
      errors.newPassword = "New password is required";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    }

    if (newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters long";
    } else if (newPassword.length > 16) {
      errors.newPassword = "Password must not exceed 16 characters";
    } else if (/\s/.test(newPassword)) {
      errors.newPassword = "Password must not contain spaces";
    } else if (!/[A-Z]/.test(newPassword)) {
      errors.newPassword =
        "Password must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(newPassword)) {
      errors.newPassword = "Password must contain at least one number";
    } else if (!/[^A-Za-z0-9\s]/.test(newPassword)) {
      errors.newPassword =
        "Password must contain at least one special character";
    }

    // Confirm password
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Return validation errors
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // req.user comes from authenticateUser middleware
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        errors: {},
      });
    }

    if (!user.isEnabled) {
      return res.status(403).json({
        success: false,
        message: "Your account has been disabled",
        errors: {},
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
        errors: {
          currentPassword: "Current password is incorrect",
        },
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from your current password",
        errors: {
          newPassword:
            "New password must be different from your current password",
        },
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    // Clear password reset information
    user.resetOtpHash = null;
    user.resetOtpExpires = null;
    user.resetOtpAttempts = 0;

    user.resetTokenHash = null;
    user.resetTokenExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to change password",
      errors: {},
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password is required",
        errors: {},
      });
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        errors: {},
      });
    }

    if (!user.isEnabled) {
      return res.status(403).json({
        success: false,
        message: "Your account has already been disabled",
        errors: {},
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect current password",
        errors: {},
      });
    }

    // Delete user's resumes
    await Resume.deleteMany({
      userId: userId,
    });

    // Delete user's mock interviews
    await MockInterview.deleteMany({
      userId: userId,
    });

    // Delete user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully.",
    });
  } catch (error) {
    console.error("Delete account error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete account",
      errors: {},
    });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  resendOtp,
  changePassword,
  deleteAccount,
};
