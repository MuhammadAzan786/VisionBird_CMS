const mongoose = require("mongoose");

const emp_of_week_Schema = new mongoose.Schema({
  employee: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  evaluation_date: {
    type: Date,
    required: true,
  },
  behavior_points: {
    type: Number,
    default: 0,
    required: true,
  },
  work_attitude_points: {
    type: Number,
    default: 0,
    required: true,
  },
  quality_of_work_points: {
    type: Number,
    default: 0,
    required: true,
  },
  work_creativity: {
    type: Number,
    default: 0,
    required: true,
  },
  mistakes_points: {
    type: Number,
    default: 0,
    required: true,
  },
  leave: {
    type: Boolean,
    required: true,
  },
  total_points: {
    type: Number,
    default: 0,
    required: true,
  },
  week_no: {
    type: Number,
    required: true,
  },
});

const emp_of_week = mongoose.model("EmployeeOfWeek", emp_of_week_Schema);

module.exports = emp_of_week;
