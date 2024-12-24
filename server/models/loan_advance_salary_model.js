const mongoose = require("mongoose");

const transactionHistory = new mongoose.Schema(
  {
    paidDate: {
      type: Date,
    },
    loanAmountRemaning: {
      type: Number,
    },
    installmentRemaning: {
      type: Number,
    },
  },
  { _id: false }
);

const loanAdvanceSalarySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Types.ObjectId,
    ref: "Employee",
  },
  basicSalary: {
    type: Number,
  },
  loanAmount: {
    type: Number,
  },
  repaymentMethod: {
    type: String,
    enum: ["salaryDeduction", "directPayment"],
    default: "salaryDeduction",
  },
  numberOfInstallments: {
    type: Number,
  },
  amountPerInstallment: {
    type: Number,
  },
  reasonForAdvance: {
    type: String,
  },
  activityStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  transactionHistory: {
    type: [transactionHistory],
  },
});

const Loan_Advance_Salary_Model = mongoose.model("Loan_Advance_Salary_Model", loanAdvanceSalarySchema);

module.exports = Loan_Advance_Salary_Model;
