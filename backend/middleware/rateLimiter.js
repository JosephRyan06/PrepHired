const rateLimit = require("express-rate-limit");
const { forgotPassword } = require("../controller/mobileAuthController");

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Login failed",
      errors: {
        general: "Please try again after 15 minutes.",
      },
    });
  },

  standardHeaders: true,
  legacyHeaders: false,
});

// Register rate limiter
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Registration failed",
      errors: {
        general: "Please try again after 15 minutes.",
      },
    });
  },

  standardHeaders: true,
  legacyHeaders: false,
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 3,

  message: {
    message:
      "Too many password reset requests. Please try again after 15 minutes.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
};
