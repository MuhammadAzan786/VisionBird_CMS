const mongoose = require("mongoose");
const moment = require("moment-timezone");

// Get current UTC time
const utcTime = new Date();
// console.log(`Current UTC Time: ${utcTime.toISOString()}`);

// Convert to PKT
const pktTime = moment
  .utc(utcTime)
  .tz("Asia/Karachi")
  .format("YYYY-MM-DD HH:mm:ss");
// console.log(`Current PKT Time: ${pktTime}`);

const taskSchema = new mongoose.Schema(
  {
    employee_obj_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    manager_obj_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    taskTicketNo: {
      type: String,
      required: true,
    },
    taskPriority: {
      type: String,
      required: true,
    },
    taskTime_1: {
      type: {
        date_time: {
          type: Number,
          required: true,
        },
        points: {
          type: Number,
          required: true,
        },
      },
      required: true,
    },
    taskTime_2: {
      type: {
        date_time: {
          type: Number,
          required: true,
        },
        points: {
          type: Number,
          required: true,
        },
      },
      required: true,
    },
    taskTime_3: {
      type: {
        date_time: {
          type: Number,
          required: true,
        },
        points: {
          type: Number,
          required: true,
        },
      },
      required: true,
    },
    taskType: {
      type: String,
      required: true,
    },
    taskStatus: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
      required: true,
    },
    taskStartTime: {
      type: Date,
    },
    taskcompleteTime: {
      type: Date,
    },
    taskcompleteStatus: {
      type: String,
      enum: ["Task UnComplete", "On Time", "Late"],
      default: "Task UnComplete",
      required: true,
    },
    pointsGained: {
      type: Number,
      default: 0,
    },
    DateTime: {
      type: String,
      default: pktTime,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
