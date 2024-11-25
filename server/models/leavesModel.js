const mongoose = require("mongoose");

const leavesSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    for: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    leaveCategory: {
      type: String,
      enum: ["Paid Leave", "Unpaid Leave"],
      required: true,
    },
    leaveType: {
      type: String,
      required: true,
    },
    selectedDate: {
      type: Date,
    },
    reason: {
      type: String,
      required: true,
    },
    leavesStart: {
      type: String,
    },
    leavesEnd: {
      type: String,
    },
    fromTime: {
      type: String,
    },
    toTime: {
      type: String,
    },
    status: {
      type: String,
      default: 'Pending',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const leavesModel = mongoose.model("leaves", leavesSchema);
module.exports = leavesModel;