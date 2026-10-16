require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const mobileAuthRoutes = require("./routes/mobileAuthRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const mockInterviewRoutes = require("./routes/mockInterviewRoutes");
const progressRoutes = require("./routes/progressRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true, message: "PrepHired server is running" });
});

app.use("/api/mobile/auth", mobileAuthRoutes);
app.use("/api/mobile/resume", resumeRoutes);
app.use("/api/mobile/mockInterview", mockInterviewRoutes);
app.use("/api/mobile/progress", progressRoutes);

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
