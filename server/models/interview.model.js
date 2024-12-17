const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    workExp: {
      type: String,
      enum: ["yes", "no"],
      required: true,
    },
    applyFor: {
      type: String,
      required: true,
    },
    internshipType: {
      type: String,
    },
    appliedOn: {
      type: Date,
      required: true,
    },
    interviewCall: {
      type: Date,
      required: true,
    },
    interviewTime: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      enum: ["pending", "appeared", "notAppeared"],
      default: "pending",
      required: true,
    },
    interviewRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    testRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    overallRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    expectedSalary: {
      type: Number,
    },
    expertiseAndSkills: {
      type: String,
    },
    CvUpload: {
      type: String,
    },
    CNIC: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model("Interview", interviewSchema);
module.exports = Interview;
