const mongoose = require("mongoose");

const attendenceSchema = new mongoose.Schema({
  attendance_date: {
    type: Date,
    required: true,
  },
  employee_obj_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  attendance: {
    type: String,
    required: true,
  },
  leaveStatus: {
    type: String,
    required: true,
  },
});

const Attendence = mongoose.model("Attendence", attendenceSchema);
module.exports = Attendence;
