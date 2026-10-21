const mongoose = require("mongoose");

const counselingAppointmentSchema = new mongoose.Schema(
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
    requestedBy: {
      type: String,
      enum: ["student", "counselor"],
      required: true,
    },
    startsAt: { type: Date, required: true, index: true },
    purpose: { type: String, trim: true, maxlength: 1000, default: "" },
    status: {
      type: String,
      enum: ["requested", "confirmed", "completed", "cancelled"],
      default: "requested",
      index: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  "CounselingAppointment",
  counselingAppointmentSchema,
);