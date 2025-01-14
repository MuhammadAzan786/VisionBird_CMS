const Loan_Advance_Salary_Model = require("../../models/loan_advance_salary_model");
const advance_payments_calculation = async (activityStatus, employeeId) => {
  // console.log("advance_payments_calculation", activityStatus, employeeId);
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

    const { _id, loanAmount, amountPerInstallment, numberOfInstallments, transactionHistory } = loanApplication;

    return {
      isLoanActive: true,
      loanAmount,
      amountPerInstallment,
      numberOfInstallments,
      transactionHistory,
      loanId: _id,
    };
  } catch (error) {
    console.log("ADVANCE PAYMENT CALCULATION", error);
  }
};

module.exports = advance_payments_calculation;
