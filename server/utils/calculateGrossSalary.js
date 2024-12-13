const salaryModel = require("../models/salarymodel");
const calculateGrossSalary = async (employee) => {
  let basic_pay = 0;
  let allowances = 0;
  let gross_salary = 0;

  try {
    if (employee.probationPeriod === "yes") {
      const numOfMonthSalaryPaid = await salaryModel.countDocuments({
        employee_obj_id: employee._id,
      });

      const totalSalariesPaid = numOfMonthSalaryPaid + 1;

      if (totalSalariesPaid <= employee.probationMonth) {
        basic_pay = Number(employee.BasicPayInProbationPeriod);
        allowances = Number(employee.AllowancesInProbationPeriod);
      } else {
        basic_pay = Number(employee.BasicPayAfterProbationPeriod);
        allowances = Number(employee.AllowancesAfterProbationPeriod);
      }
    } else if (employee.probationPeriod === "no") {
      basic_pay = Number(employee.BasicPayAfterProbationPeriod);
      allowances = Number(employee.AllowancesAfterProbationPeriod);
    }

    gross_salary = basic_pay + allowances;

    return { basic_pay, allowances, gross_salary };
  } catch (error) {
    console.log("ERROR CALCULATE GROSS SALARY", error);
  }
};

module.exports = calculateGrossSalary;
