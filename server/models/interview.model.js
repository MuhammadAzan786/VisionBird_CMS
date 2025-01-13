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
    interviewCalled: {
      type: String,
      enum: ["yes", "no"],
      required: true,
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
      default: "00000-0000000-0",
      set: (value) =>
        value && value.trim() !== "" ? value : "00000-0000000-0",
    },
    remarks: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

interviewSchema.pre("save", function (next) {
  if (this.interviewCalled === "no") {
    this.interviewCall = null;
    this.interviewTime = "";
  }
  next();
});

const Interview = mongoose.model("Interview", interviewSchema);
module.exports = Interview;
