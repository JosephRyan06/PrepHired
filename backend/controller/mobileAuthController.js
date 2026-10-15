const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Resume = require("../models/resume");
const MockInterview = require("../models/mockInterview");

const { sendPasswordResetOtp, sendVerificationEmail } = require("../services/emailService");

/*
const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      termsAccepted,
    } = req.body;

    const fullName = `${firstName || ""} ${lastName || ""}`.trim();
    const role = "user";
    const errors = {};

    // Required fields
    if (!firstName) {
      errors.firstName = "First name is required";
    }

    if (!lastName) {
      errors.lastName = "Last name is required";
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

    //name validation
    if (firstName && /\d/.test(firstName)) {
      errors.firstName = "First name must not contain numbers";
    }

    if (lastName && /\d/.test(lastName)) {
      errors.lastName = "Last name must not contain numbers";
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
      firstName: firstName.trim(),
      lastName: lastName.trim(),
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
        firstName: user.firstName,
        lastName: user.lastName,
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
*/
const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      termsAccepted,
    } = req.body;

    const errors = {};

    // Required fields
    if (typeof firstName !== "string" || !firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (typeof lastName !== "string" || !lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (typeof email !== "string" || !email.trim()) {
      errors.email = "Email is required";
    }

    if (typeof password !== "string" || !password) {
      errors.password = "Password is required";
    }

    if (!termsAccepted) {
      errors.termsCondition =
        "You must agree to the Terms and Conditions";
    }

    if (typeof confirmPassword !== "string" || !confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    }

    // Normalize names
    const normalizedFirstName =
      typeof firstName === "string" ? firstName.trim() : "";

    const normalizedLastName =
      typeof lastName === "string" ? lastName.trim() : "";

    // Name validation
    if (normalizedFirstName && /\d/.test(normalizedFirstName)) {
      errors.firstName = "First name must not contain numbers";
    }

    if (normalizedLastName && /\d/.test(normalizedLastName)) {
      errors.lastName = "Last name must not contain numbers";
    }

    // Email validation
    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";

    if (
      normalizedEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
      errors.email = "Invalid email format";
    }

    // Password validation
    if (typeof password === "string" && password.length > 0) {
      if (password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
      } else if (password.length > 16) {
        errors.password = "Password must not exceed 16 characters";
      } else if (/\s/.test(password)) {
        errors.password = "Password must not contain spaces";
      } else if (!/[A-Z]/.test(password)) {
        errors.password =
          "Password must contain at least one uppercase letter";
      } else if (!/[0-9]/.test(password)) {
        errors.password =
          "Password must contain at least one number";
      } else if (!/[^A-Za-z0-9\s]/.test(password)) {
        errors.password =
          "Password must contain at least one special character";
      }
    }

    // Confirm password
    if (
      typeof password === "string" &&
      typeof confirmPassword === "string" &&
      password.length > 0 &&
      confirmPassword.length > 0 &&
      password !== confirmPassword
    ) {
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
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Registration failed",
        errors: {
          email: "Email already exists",
        },
      });
    }

    // Generate secure email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Store only the token hash
    const emailVerificationTokenHash = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // Token expires in 10 minutes
    const emailVerificationTokenExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create unverified user
    const user = await User.create({
      firstName: normalizedFirstName,
      lastName: normalizedLastName,
      fullName: `${normalizedFirstName} ${normalizedLastName}`,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
      isEnabled: true,
      isEmailVerified: false,
      termsAccepted,
      emailVerificationTokenHash,
      emailVerificationTokenExpires,
    });

    // Send verification link to Gmail
    try {
      await sendVerificationEmail(user.email, verificationToken);
    } catch (emailError) {
      console.error("Verification email error:", emailError);

      // Avoid leaving an unusable account if email delivery fails
      await User.findByIdAndDelete(user._id);

      return res.status(500).json({
        success: false,
        message:
          "Unable to send verification email. Please try registering again.",
      });
    }

    // Do not return a JWT or treat the user as logged in
    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your Gmail and click the verification link before logging in.",
      requiresEmailVerification: true,
      email: user.email,
    });
  } catch (error) {
    console.error("Register error:", error);

    // Handle duplicate email race conditions
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Registration failed",
        errors: {
          email: "Email already exists",
        },
      });
    }

    return res.status(500).json({
      success: false,
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

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Login failed",
        errors: {
          general: "Please verify your email before logging in.",
        },
        requiresEmailVerification: true,
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
        firstName: user.firstName,
        lastName: user.lastName,
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

    // Validate reset token
    if (typeof resetToken !== "string" || !resetToken.trim()) {
      return res.status(400).json({
        success: false,
        message: "Password reset authorization is required",
        errors: {
          resetToken: "Password reset authorization is required",
        },
      });
    }

    // Validate required fields
    if (typeof password !== "string" || !password.trim()) {
      errors.password = "Password is required";
    }

    if (typeof confirmPassword !== "string" || !confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your password";
    }

    // Validate password length and complexity only if provided
    if (typeof password === "string" && password.trim()) {
      if (password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
      } else if (password.length > 16) {
        errors.password = "Password must not exceed 16 characters";
      } else if (/\s/.test(password)) {
        errors.password = "Password must not contain spaces";
      } else if (!/[A-Z]/.test(password)) {
        errors.password = "Password must contain at least one uppercase letter";
      } else if (!/[0-9]/.test(password)) {
        errors.password = "Password must contain at least one number";
      } else if (!/[^A-Za-z0-9\s]/.test(password)) {
        errors.password =
          "Password must contain at least one special character";
      }
    }

    // Validate password confirmation
    if (
      typeof password === "string" &&
      typeof confirmPassword === "string" &&
      password.length > 0 &&
      confirmPassword.length > 0 &&
      password !== confirmPassword
    ) {
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

    // Hash reset token
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Find user with a valid, unexpired reset token
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
        errors: {
          resetToken: "Invalid or expired password reset session",
        },
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    user.password = hashedPassword;

    // Clear reset token information
    user.resetTokenHash = null;
    user.resetTokenExpires = null;

    // Clear OTP information
    user.resetOtpHash = null;
    user.resetOtpExpires = null;
    user.resetOtpAttempts = 0;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset password",
      errors: {},
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

    if (!newPassword || !newPassword.trim()) {
      errors.newPassword = "New password is required";
    }

    if (!confirmPassword || !confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your new password";
    }

    // Validate password length and complexity only if provided
    if (newPassword && newPassword.trim()) {
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
    }

    // Check confirmation only when both fields have values
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

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

const editProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    const errors = {};

    // Validate required fields
    if (typeof firstName !== "string" || !firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (typeof lastName !== "string" || !lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    // Validate names do not contain numbers
    if (typeof firstName === "string" && /\d/.test(firstName)) {
      errors.firstName = "First name must not contain numbers";
    }

    if (typeof lastName === "string" && /\d/.test(lastName)) {
      errors.lastName = "Last name must not contain numbers";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // Get authenticated user
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

    // Normalize names
    const normalizedFirstName = firstName.trim();
    const normalizedLastName = lastName.trim();

    // Update profile
    user.firstName = normalizedFirstName;
    user.lastName = normalizedLastName;
    user.fullName = `${normalizedFirstName} ${normalizedLastName}`;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isEnabled: user.isEnabled,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update profile",
      errors: {},
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (typeof token !== "string" || !token.trim()) {
      return res.status(400).send(`
        <h2>Invalid verification link</h2>
        <p>Please use the verification link from your PrepHired email.</p>
      `);
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      emailVerificationTokenHash: tokenHash,
      emailVerificationTokenExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return res.status(400).send(`
        <h2>Verification link expired or invalid</h2>
        <p>Please request a new verification email or register again.</p>
      `);
    }

    user.isEmailVerified = true;
    user.emailVerificationTokenHash = null;
    user.emailVerificationTokenExpires = null;

    await user.save();

    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Email Verified | PrepHired</title>
        </head>
        <body style="
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 60px 20px;
          background: #f1f5f9;
          color: #111827;
        ">
          <div style="
            max-width: 420px;
            margin: auto;
            padding: 30px;
            background: white;
            border-radius: 16px;
          ">
            <h1 style="color: #2563eb;">Email Verified!</h1>
            <p>Your PrepHired email has been verified successfully.</p>
            <p>You can now return to the PrepHired app and log in.</p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Email verification error:", error);

    return res.status(500).send(`
      <h2>Something went wrong</h2>
      <p>Please try again later.</p>
    `);
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
  editProfile,
  verifyEmail
};
