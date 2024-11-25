const mongoose = require('mongoose');

const EmpOfWeekWinnersSchema = new mongoose.Schema({
  week_no: {
    type: Number,
    required: true,
  },
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // Adjust if your employee model is named differently
    required: true,
  },
  employee_name: {
    type: String,
    required: true,
  },
  total_points: {
    type: Number,
    required: true,
  },
  award_date: {
    type: Date,
    default: Date.now, // Automatically set to the current date
  },
});

// Index to ensure only one winner per week
EmpOfWeekWinnersSchema.index({ week_no: 1 }, { unique: true });

const EmpOfWeekWinners = mongoose.model('EmpOfWeekWinners', EmpOfWeekWinnersSchema);

module.exports = EmpOfWeekWinners;
