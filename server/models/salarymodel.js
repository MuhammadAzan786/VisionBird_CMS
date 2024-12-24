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
    halfLeavesCount: {
      type: Number,
      default: 0,
    },
    casualLeaves: {
      type: Number,
      default: 0,
    },
    sickLeaves: {
      type: Number,
      default: 0,
    },
    unpaidLeavesCount: {
      type: Number,
      default: 0,
    },
    paidLeavesCount: {
      type: Number,
      default: 0,
    },
    otherLeaves: {
      type: Number,
      default: 0,
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

const loanDetails = new mongoose.Schema(
  {
    isLoanActive: {
      type: Boolean,
      default: false,
    },

    loanId: {
      type: mongoose.Types.ObjectId,
      ref: "Loan_Advance_Salary_Model",
      required: function () {
        return this.isLoanActive === true;
      },
    },
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

  paidDate: { type: Date, required: true },

  salaryDetails,
  paymentDetails,
  workDetails,
  leaveDetails,
  bonusDetails,

  loanDetails,

  netSalary: { type: Number, required: true },
});

salarySchema.index({ employee_obj_id: 1, salary_month: 1, salary_year: 1 }, { unique: true });
const Salary = mongoose.model("Salary", salarySchema);
module.exports = Salary;
