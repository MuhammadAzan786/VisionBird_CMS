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
    salaryId: {
      type: mongoose.Types.ObjectId,
      ref: "Salary",
      required: true,
    },
  },
  {
    _id: false,
  }
);

const loanAdvanceSalarySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Types.ObjectId,
    ref: "Employee",
  },
  grossSalary: {
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
    enum: ["pending", "approved", "rejected", "active", "completed"],
    default: "active",
  },

  transactionHistory: {
    type: [transactionHistory],
  },
});

loanAdvanceSalarySchema.pre("save", async function (next) {
  if (this.repaymentMethod === "directPayment") {
    this.numberOfInstallments = null;
    this.amountPerInstallment = null;
    this.transactionHistory = null;
  }
  next();
});

loanAdvanceSalarySchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  console.log("update me te au", update);

  if (update.activityStatus) {
    return next();
  }

  const lastTransaction = update.$push.transactionHistory;

  if (lastTransaction.installmentRemaning === 0) {
    this.setUpdate({
      ...update,
      $set: { activityStatus: "completed" },
    });
  }

  next();
});

loanAdvanceSalarySchema.index(
  { employeeId: 1, activityStatus: 1 },
  {
    unique: true,
    partialFilterExpression: {
      activityStatus: { $in: ["pending", "active"] },
    },
  }
);

const Loan_Advance_Salary_Model = mongoose.model("Loan_Advance_Salary_Model", loanAdvanceSalarySchema);

module.exports = Loan_Advance_Salary_Model;
