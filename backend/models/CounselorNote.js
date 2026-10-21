const mongoose = require("mongoose");

const counselorNoteSchema = new mongoose.Schema(
  {
    counselorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("CounselorNote", counselorNoteSchema);