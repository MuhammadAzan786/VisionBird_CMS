const mongoose = require("mongoose");

const taskTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const TaskType = mongoose.model("TaskType", taskTypeSchema);


module.exports = TaskType;
