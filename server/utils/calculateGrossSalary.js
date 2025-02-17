const salaryModel = require("../models/salarymodel");
const calculateGrossSalary = async (employee) => {
  let basicPay = 0;
  let allowances = 0;
  let grossSalary = 0;

  try {
    if (employee.probationPeriod === "yes") {
      const numOfMonthSalaryPaid = await salaryModel.countDocuments({
        employee_obj_id: employee._id,
      });

      const totalSalariesPaid = numOfMonthSalaryPaid + 1;

      if (totalSalariesPaid <= employee.probationMonth) {
        basicPay = Number(employee.BasicPayInProbationPeriod);
        allowances = Number(employee.AllowancesInProbationPeriod);
      } else {
        basicPay = Number(employee.BasicPayAfterProbationPeriod);
        allowances = Number(employee.AllowancesAfterProbationPeriod);
      }
    } else if (employee.probationPeriod === "no") {
      console.log("Probabtion Period No");

      basicPay = Number(employee.BasicPayAfterProbationPeriod);
      allowances = Number(employee.AllowancesAfterProbationPeriod);
    }

    grossSalary = basicPay + allowances;
    console.log("grosssssss", grossSalary);

    return { basicPay, allowances, grossSalary };
  } catch (error) {
    console.log("ERROR CALCULATE GROSS SALARY", error);
  }
};

module.exports = calculateGrossSalary;
