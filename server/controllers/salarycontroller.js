const salaryModel = require("../models/salarymodel");
const employeeModel = require("../models/employeemodel");
const loanModel = require("../models/loanModel");
const advanceSalaryModel = require("../models/advance_salary_model");
const functions = require("../controllers/functions");
const db = require("../config/db_connection");

module.exports = {
  pay_salary: async (req, res) => {
    try {
      const { button } = req.body;

      console.log("ye req ki body hai", req.body);

      let basicpay, allowances, grossSalary, per_day_wage, per_hour_wage, num_of_month_salary_paid;

      const cheque_number = req.body.cheque_number;
      const employee_id = req.params.id;
      const salary_month = req.body.salary_month;
      const salary_year = req.body.salary_year;
      const incentive = Number(+req.body.incentive) || 0;
      const daysInMonth = (salary_year, salary_month) => new Date(salary_year, salary_month, 0).getDate();
      const employee = await employeeModel.findOne({ _id: employee_id });
      const paidLeaves = Number(+req.body.paid_leaves) || 0;
      const halfLeaves = Number(+req.body.Half_leaves) || 0;
      unpaid_fullday_leaves = Number(+req.body.unpaid_leaves) || 0;
      let unpaid_half_leaves = 0;
      unpaid_half_leaves = halfLeaves > 2 ? halfLeaves - 2 : 0;
      const total_unpaid_leaves = unpaid_fullday_leaves + unpaid_half_leaves;

      const days = daysInMonth(salary_year, salary_month);

      const bonus = Number(+req.body.extra_bonus) || 0;

      const leaves = total_unpaid_leaves + paidLeaves;
      const num_sundays_saturdays = functions.countSundaysAndSaturdays(salary_year, salary_month);
      const total_days_worked = days - (num_sundays_saturdays.saturdays + num_sundays_saturdays.sundays) - leaves;
      const working_days_without_weekends = days - (num_sundays_saturdays.saturdays + num_sundays_saturdays.sundays);

      if (employee.probationPeriod == "yes") {
        num_of_month_salary_paid = await salaryModel.countDocuments({
          employee_obj_id: employee_id,
        });
        total_salaries_paid = num_of_month_salary_paid + 1;
        if (total_salaries_paid <= employee.probationMonth) {
          basicpay = Number(employee.BasicPayInProbationPeriod);
          allowances = Number(employee.AllowancesInProbationPeriod);
          grossSalary = basicpay + allowances + incentive;
        } else if (total_salaries_paid >= employee.probationMonth) {
          basicpay = Number(employee.BasicPayAfterProbationPeriod);
          allowances = Number(employee.AllowancesAfterProbationPeriod);
          grossSalary = basicpay + allowances + incentive;
        }
      } else if (employee.probationPeriod == "no") {
        basicpay = Number(employee.BasicPayAfterProbationPeriod);
        allowances = Number(employee.AllowancesAfterProbationPeriod);
        grossSalary = basicpay + allowances + incentive;
      }
      per_day_wage = grossSalary / days;
      per_hour_wage = per_day_wage / 8;
      const amountDeducted = total_unpaid_leaves * per_day_wage;
      console.log("Amount Deducted", amountDeducted);
      let net_salary = grossSalary + bonus - amountDeducted;

      console.log("Advance Payment se phly net ki value", net_salary);

      // ================= Advance Payment ===================== //

      const loan = await loanModel.findOne({
        employee_obj_id: employee_id,
        activity_status: "active",
      });
      const advanceSalary = await advanceSalaryModel.findOne({
        employee_obj_id: employee_id,
        activity_status: "active",
      });

      if (loan) {
        loan.loan_deducted = Math.round(loan.loan_left / loan.installment_duration_months);
        net_salary -= loan.loan_deducted;
        loan.loan_left -= loan.loan_deducted;
        loan.installment_duration_months = loan.installment_duration_months - 1;
        console.log("if loan Salar", net_salary);
      }

      if (advanceSalary) {
        advanceSalary.advance_salary_deducted = 1;
        advanceSalary.advance_salary_left -= 1;

        net_salary -= basicpay;
        console.log("if Advance Salar", net_salary);
      }

      // ================= Advance Payment ===================== //

      //button logic
      if (button === "Show_Salary_Details") {
        // console.group();
        console.log("Generate Button Clicked !!!");
        console.log("net_salary", net_salary);

        return res.json({
          basicPay: basicpay,
          allowances: allowances,
          bonus: bonus,
          grossSalary: grossSalary,
          days: days,
          working_days_without_weekends: working_days_without_weekends,
          per_day_wage: per_day_wage,
          per_hour_wage: per_hour_wage,
          num_sundays_saturdays: num_sundays_saturdays,
          total_days_worked: total_days_worked,
          leaves: leaves,
          unpaid_fullday_leaves: unpaid_fullday_leaves,
          paidLeaves: paidLeaves,
          total_unpaid_leaves: total_unpaid_leaves,
          unpaid_half_leaves: unpaid_half_leaves,
          amountDeducted: amountDeducted,
          net_salary,
          probationPeriod: employee.probationPeriod,
          probationMonth: employee.probationMonth,
          loan,
          advanceSalary,
        });
      } else if (button === "Post_Salary") {
        // Stored salary data in a object for later modification.
        console.log("Save Details Button Clicked !!!");
        const salaryData = {
          employee_obj_id: employee_id,
          salary_month: salary_month,
          salary_year: salary_year,
          Half_leaves: halfLeaves,
          Full_leaves: leaves,
          paid_leaves: paidLeaves,
          unpaid_leaves: total_unpaid_leaves,
          incentive: incentive,
          gross_salary: grossSalary,
          net_salary: net_salary,
          extra_bonus: bonus,
          cheque_number,
        };

        //if both loan and advance salary dont exist simply save to salary.
        if (!loan && !advanceSalary) {
          await salaryModel.create(salaryData);
        }

        // if Loan Exist Save Loan detials and add to Salary Model .
        if (loan) {
          const salaryWithLoanData = {
            ...salaryData,
            loan_deduction_active: true,
            loan_deduction_amount: loan.loan_deducted,
            loan_remaining_amount: loan.loan_left,
          };

          await salaryModel.create(salaryWithLoanData);

          await loanModel.findOneAndUpdate(
            { employee_obj_id: employee_id, activity_status: "active" },
            {
              $set: {
                loan_left: loan.loan_left,
                loan_deducted: loan.loan_deducted,
                installment_duration_months: loan.installment_duration_months,
              },
            },
            { new: true, runValidators: true }
          );
        }

        // if Advance Salary Exist Save Advance Salary Detail and add to Salary Model.
        if (advanceSalary) {
          const salaryWithAdvanceData = {
            ...salaryData,
            advance_salary_deduction_active: true,
            advance_salary_deduction: advanceSalary.advance_salary_deducted,
            advance_salary_reamining: advanceSalary.advance_salary_left,
          };

          await salaryModel.create(salaryWithAdvanceData);
          await advanceSalaryModel.findOneAndUpdate(
            { employee_obj_id: employee_id, activity_status: "active" },
            {
              $set: {
                advance_salary_left: advanceSalary.advance_salary_left,
                advance_salary_deducted: advanceSalary.advance_salary_deducted,
              },
            },
            { new: true, runValidators: true }
          );
        }
      }
    } catch (error) {
      res.send(error);
    }
  },

  getSingleSalary: async (req, res) => {
    try {
      const { id } = req.params;
      console.log("id aa gyi", id);

      const salary = await salaryModel
        .findById(id)
        .populate(
          "employee_obj_id",
          "employeeName gender employeeCNIC employeeID employeeDesignation mailingAddress BasicPayAfterProbationPeriod AllowancesAfterProbationPeriod bankAccountNumber dateOfBirth dateOfJoining"
        );

      const { employee_obj_id, ...salaryData } = salary.toObject(); // Convert to a plain JavaScript object
      const result = {
        ...salaryData, // Spread salary data
        ...employee_obj_id, // Spread employee object fields
      };

      console.log("slaart mil gyi", result);
      res.status(200).json({ result });
    } catch (error) {
      console.log("Get Single Salary Error", error);
      res.status(501).json({ message: "No Record Found" });
    }
  },

  monthly_salary_report: async (req, res) => {
    try {
      const month = req.body.month;
      const year = req.body.year;
      if (!month || !year) {
        return res.status(400).send({ error: "Month and Year are required" });
      }
      const data = await salaryModel.find({
        salary_month: month,
        salary_year: year,
      });
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while fetching salary records" });
    }
  },

  yearly_salary_report_all_employees: async (req, res) => {
    const year = req.body.year;
    try {
      // Fetch all employees from your database
      const employees = await employeeModel.find();

      // Define an array to hold the names of the months
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      // Initialize an array to hold the formatted data for all employees
      const formattedData = [];

      // Iterate over each employee
      for (const employee of employees) {
        // Check if employee._id or employee.emp_id is undefined
        if (!employee._id) {
          console.error("Employee ID is undefined:", employee);
          continue; // Skip this employee and move to the next one
        }

        // Initialize an object to hold the formatted data for the current employee
        const employeeData = {
          id: employee._id,
          // name: employee.employeeName + " " + employee.employeeFatherName,
          name: employee.employeeName,
          emp_id: employee.employeeID,
          emp_img: employee.employeeProImage,
          // Initialize an array to hold the monthly salary status for the current employee
          monthlySalaryStatus: [],
        };

        // Iterate over each month
        for (let month = 1; month <= 12; month++) {
          // Check if the salary record for the current month exists
          const salaryRecord = await salaryModel.findOne({
            employee_obj_id: employee._id, // Assuming employee._id is the unique identifier
            salary_month: month,
            salary_year: year,
          });

          // Determine if the salary has been paid for the current month
          const isSalaryPaid = salaryRecord ? "Paid" : "Unpaid";

          // Push the monthly salary status to the employeeData object
          employeeData.monthlySalaryStatus.push({
            month: monthNames[month - 1], // Get the month name from the monthNames array
            status: isSalaryPaid,
          });
        }

        // Push the formatted data for the current employee to the formattedData array
        formattedData.push(employeeData);
      }

      // Prepare the response
      res.status(200).json(formattedData);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "An error occurred while fetching salary records for all employees",
      });
    }
  },

  paid_unpaid_salary_report: async (req, res) => {
    try {
      const { month, year } = req.body;
      if (!month || !year) {
        return res.status(400).send({ error: "Month and Year are required" });
      }
      // Fetch all employees
      // const employees = await employeeModel.find();
      const employees = await employeeModel.find({ role: { $ne: "admin" } });

      const salaries = await salaryModel.find({
        salary_month: month,
        salary_year: year,
      });

      // Separate paid and unpaid employees based on salary records
      const paidEmployees = [];
      const unpaidEmployees = [];
      const allEmployees = [];

      // Check if salary record exists for each employee
      employees.forEach((employee) => {
        const hasSalaryRecord = salaries.some((salary) => String(salary.employee_obj_id) === String(employee._id));
        const filteredSalary = salaries.find((salary) => String(salary.employee_obj_id) === String(employee._id));
        if (hasSalaryRecord) {
          paidEmployees.push({ ...employee.toObject(), salary_id: filteredSalary._id, salary_status: "paid" });
          allEmployees.push({ ...employee.toObject(), salary_id: filteredSalary._id, salary_status: "paid" });
        } else {
          unpaidEmployees.push({
            ...employee.toObject(),
            salary_status: "unpaid",
          });
          allEmployees.push({
            ...employee.toObject(),

            salary_status: "unpaid",
          });
        }
      });

      res.json({ paidEmployees, unpaidEmployees, allEmployees });
    } catch (err) {
      console.error("Error fetching employees salary status:", err);
      res.status(500).json({ message: "Server Error" });
    }
  },

  explainQuery: async (req, res) => {
    try {
      const db = req.db;

      // Execute the query with explain()
      const query = db
        .collection("salary")
        .find({
          employee_obj_id: ObjectId("employee_obj_id"),
          salary_month: 8,
          salary_year: 2024,
        })
        .explain("executionStats");

      // Send the explain result as the API response
      res.json(query);
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Error executing query" });
    }
  },
};
