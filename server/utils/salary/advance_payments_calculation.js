const Loan_Advance_Salary_Model = require("../../models/loan_advance_salary_model");
const advance_payments_calculation = async (activityStatus, employeeId) => {
  console.log("advance_payments_calculation", activityStatus, employeeId);
  try {
    const loanApplication = await Loan_Advance_Salary_Model.findOne({
      employeeId,
      activityStatus,
    });

    if (!loanApplication) {
      console.log("DOCUMNET nai GYA", loanApplication);
      return { isLoanActive: false };
    }

    if (loanApplication.repaymentMethod === "directPayment") {
      return { isLoanActive: false };
    }

    const { _id, loanAmount, amountPerInstallment } = loanApplication;

    return { isLoanActive: true, loanAmount, amountPerInstallment, loanId: _id };
  } catch (error) {
    console.log("ADVANCE PAYMENT CALCULATION", error);
  }
};

module.exports = advance_payments_calculation;

// const apply_loan = (loan, installments) => {
//   const basicPay = 25000;
//   const allowances = 6000;
//   const grossPay = basicPay + allowances; //400000
//   const installmentPaidInfo = [];
//   console.log("\n********************\n");

//   const installmentAmount = Math.round(loan / installments);
//   console.log("INSTALLMENT AMOUNT", installmentAmount);

//   if (installmentAmount > grossPay) {
//     console.log("INSTALLMENT PLAN IS INVALID");
//     return;
//   }

//   const netSalary = grossPay - installmentAmount;
//   console.log("NET SALARY", netSalary);
//   const loanLeft = loan - installmentAmount;
//   console.log("AMOUNT LEFT", amountLeft);
//   const installmentLeft = installments - 1;
//   console.log("INSTALLMENT LEFT", installmentLeft);

//   installmentPaidInfo.push({
//     paidOn: "Date",
//     installmentAmount,
//     loanLeft,
//     installmentLeft,
//   });

//   console.log("\n********************\n");
//   return 0;
// };
