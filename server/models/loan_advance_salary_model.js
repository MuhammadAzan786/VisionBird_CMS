const mongoose = require("mongoose");

const transactionHistory = new mongoose.Schema({
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
});

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
    enum: ["pending", "approved", "rejected", "active", "completed"],
    default: "active",
  },
  transactionHistory: {
    type: [transactionHistory],
  },
});

// loanAdvanceSalarySchema.pre("findOneAndUpdate", async function (next) {
//   const update = this.getUpdate();
//   // console.log("hook executed", update);

//   if (update.$push && update.$push.transactionHistory) {
//     const loan = await this.model.findOne(this.getQuery());
//     console.log("hook executed loan", loan);
//     console.log("checking uodate", update.$push.transactionHistory);

//     if (loan && loan.transactionHistory.length > 0) {
//       const lastTransaction = update.$push.transactionHistory;
//       console.log("ye execute hua hai", lastTransaction);

//       if (lastTransaction.installmentRemaning === 0) {
//         this.setUpdate({
//           $set: { activityStatus: "completed" },
//         });
//       }
//     }
//   }

//   next();
// });

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
