const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema({
  employee_obj_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  salary_month: {
    type: Number,
    required: true,
  },
  salary_year: {
    type: Number,
    required: true,
  },
  Half_leaves: {
    type: Number,
    required: true,
  },
  Full_leaves: {
    type: Number,
    required: true,
  },
  paid_leaves: {
    type: Number,
    required: true,
  },
  unpaid_leaves: {
    type: Number,
    required: true,
  },
  incentive: {
    type: Number,
    required: true,
  },
  gross_salary: {
    type: Number,
    required: true,
  },
  net_salary: {
    type: Number,
    required: true,
  },
  extra_bonus: {
    type: Number,
    required: true,
  },
  cheque_number: {
    type: Number,
    default: undefined,
  },
  loan_deduction_active: {
    type: Boolean,
    default: false,
  },
  loan_deduction_amount: {
    type: Number,
    required: function () {
      return this.loan_deduction_active;
    },
  },
  loan_remaining_amount: {
    type: Number,
    required: function () {
      return this.loan_deduction_active;
    },
  },

  advance_salary_deduction_active: {
    type: Boolean,
    default: false,
  },
  advance_salary_deduction: {
    type: Number,
    required: function () {
      this.advance_salary_deduction_active;
    },
  },
  advance_salary_reamining: {
    type: Number,
    required: function () {
      this.advance_salary_deduction_active;
    },
  },
});

salarySchema.pre("save", function (next) {
  if (this.cheque_number === null) {
    this.cheque_number = undefined;
  }
  next();
});
salarySchema.index(
  { employee_obj_id: 1, salary_month: 1, salary_year: 1 },
  { unique: true }
);

const Salary = mongoose.model("Salary", salarySchema);
module.exports = Salary;
