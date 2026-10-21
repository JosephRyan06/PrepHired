require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const adminRoutes = require("./routes/adminRoutes");
const mobileAuthRoutes = require("./routes/mobileAuthRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const mockInterviewRoutes = require("./routes/mockInterviewRoutes");
const progressRoutes = require("./routes/progressRoutes");
const applicantProfileRoutes = require("./routes/applicantProfileRoutes");
const counselorRoutes = require("./routes/counselorRoutes");
const counselingRoutes = require("./routes/counselingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true, message: "PrepHired server is running" });
});

app.use("/api/admin", adminRoutes);
// Keep counselor workspace APIs separate from the upstream administrator session.
app.use("/api/counselor", counselorRoutes);
app.use("/api/mobile/auth", mobileAuthRoutes);
app.use("/api/mobile/resume", resumeRoutes);
app.use("/api/mobile/mockInterview", mockInterviewRoutes);
app.use("/api/mobile/progress", progressRoutes);
app.use("/api/mobile/applicantProfile", applicantProfileRoutes);
app.use("/api/mobile/counseling", counselingRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
