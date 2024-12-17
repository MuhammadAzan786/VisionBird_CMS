const mongoose = require("mongoose");

const salaryDetails = new mongoose.Schema(
  {
    basicPay: { type: Number, required: true },
    allowances: { type: Number, required: true },
    incentive: { type: Number, required: true },
    grossSalary: { type: Number, required: true },
  },
  { _id: false }
);

const paymentDetails = new mongoose.Schema(
  {
    paymentMethod: { type: String, enum: ["cash", "cheque", "other"], required: true },
    chequeNumber: {
      type: String,
      required: function () {
        return this.paymentMethod === "cheque";
      },
    },
    otherDetails: {
      type: String,
      required: function () {
        return this.paymentMethod === "other";
      },
    },
  },
  { _id: false }
);

const workDetails = new mongoose.Schema(
  {
    totalWorkingDays: {
      type: Number,
      default: 0,
    },
    daysWorked: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const leaveDetails = new mongoose.Schema(
  {
    half_leaves: {
      type: Number,
      default: 5,
    },
    casualLeaves: {
      type: Number,
      default: 5,
    },
    sickLeaves: {
      type: Number,
      default: 5,
    },
    unpaidLeaves: {
      type: Number,
      default: 5,
    },
    paidLeaves: {
      type: Number,
      default: 5,
    },
    yearlyLeaves: {
      type: Number,
      default: 5,
    },
    netSalaryWithLeaveCutting: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const bonusDetails = new mongoose.Schema(
  {
    extraBonusAmount: { type: Number, required: true },
    extraBonusRemarks: { type: String, default: "none" },
  },
  { _id: false }
);

const salarySchema = new mongoose.Schema({
  employee_obj_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },

  salary_month: { type: Number, required: true },
  salary_year: { type: Number, required: true },

  paidDate: { type: String, required: true },

  salaryDetails,
  paymentDetails,
  workDetails,
  leaveDetails,
  bonusDetails,

  netSalary: { type: Number, required: true },
});

salarySchema.index({ employee_obj_id: 1, salary_month: 1, salary_year: 1 }, { unique: true });
const Salary = mongoose.model("Salary", salarySchema);
module.exports = Salary;
