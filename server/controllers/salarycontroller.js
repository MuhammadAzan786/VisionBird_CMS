const salaryModel = require("../models/salarymodel");
const employeeModel = require("../models/employeemodel");
const { paid_unpaid_leaves, mapLeavesToLabels } = require("../utils/paid_unpaid_leaves");

const daysInMonth = require("../utils/date/daysInMonths");
const calculateGrossSalary = require("../utils/calculateGrossSalary");
const tax_calculator = require("../utils/taxCalculator");

const advance_payments_calculation = require("../utils/salary/advance_payments_calculation");

const Loan_Advance_Salary_Model = require("../models/loan_advance_salary_model");

module.exports = {
  //Months are comming 1-12 based
  view_salary: async (req, res) => {
    try {
      const { salary_month, salary_year, incentive, extraBonusAmount, employeeDetails, totalWorkingDays } = req.body;

      const { _id: employee_id } = employeeDetails;

      const employee = await employeeModel.findOne({ _id: employee_id });
      const { grossSalary, basicPay, allowances } = await calculateGrossSalary(employee);
      const leaveData = await paid_unpaid_leaves(employee_id, Number(salary_month), Number(salary_year));

      const { unpaidLeavesCount, leaveDetails } = leaveData;

      const numberOfDaysInMonth = daysInMonth(salary_year, salary_month);
      const perDayWage = grossSalary / numberOfDaysInMonth;
      const unpaidLeavesAmount = unpaidLeavesCount * perDayWage;

      const daysWorked = totalWorkingDays - unpaidLeavesCount;

      const netSalaryWithLeaveCutting = grossSalary + Number(incentive) - unpaidLeavesAmount;

      leaveDetails.push({
        key: "netSalaryWithLeaveCutting",
        label: "Net Salary",
        value: netSalaryWithLeaveCutting,
      });

      // Loan Calculation Perform

      let netSalaryBeforeTax = 0;

      netSalaryBeforeTax = netSalaryWithLeaveCutting + Number(extraBonusAmount);
      const loan = await advance_payments_calculation("active", employee_id);
      // console.log("data loan me return hua", loan);
      if (loan.isLoanActive) {
        netSalaryBeforeTax -= loan.amountPerInstallment;
        // console.log("Loan Nikal Dya hai");
      }

      const netSalary = tax_calculator(netSalaryBeforeTax);

      // const netSalary = netSalaryWithLeaveCutting + Number(extraBonusAmount);

      res.json({
        salaryDetails: {
          basicPay,
          allowances,
          grossSalary,
        },

        leaveDetails,

        workDetails: {
          daysWorked,
        },

        loanDetails: loan,

        netSalaryBeforeTax,
        netSalary,
      });
    } catch (error) {
      console.log("Error View Salary", error);
      res.send(error);
    }
  },

  pay_salary: async (req, res) => {
    try {
      console.log("Req agyi pay salary");
      // console.log("paidDate", req.body.paidDate);

      let {
        userId,
        salary_month,
        salary_year,
        paidDate,

        salaryDetails,
        paymentDetails,
        workDetails,
        leaveDetails,
        bonusDetails,

        loanDetails,

        netSalary,
      } = req.body;

      const { isLoanActive, loanId, loanAmount, amountPerInstallment, numberOfInstallments, transactionHistory } =
        loanDetails;

      //Mapping leaveDetail back to object form

      leaveDetails = leaveDetails.reduce((acc, item) => {
        const { key, value } = item;
        acc[key] = value;
        return acc;
      }, {});

      loanDetails = {
        isLoanActive,
        ...(isLoanActive ? { loanId } : {}),
      };

      const salaryData = {
        employee_obj_id: userId,
        salary_month,
        salary_year,
        paidDate,

        salaryDetails,
        paymentDetails,
        workDetails,
        leaveDetails,
        bonusDetails,
        loanDetails,
        netSalary,
      };

      const salaryDocument = await salaryModel.create(salaryData);

      if (isLoanActive) {
        let installmentRemaning;
        let loanAmountRemaning;

        if (transactionHistory.length === 0) {
          installmentRemaning = numberOfInstallments - 1;
          loanAmountRemaning = loanAmount - amountPerInstallment;
        } else {
          const lastTransaction = transactionHistory[transactionHistory.length - 1];
          installmentRemaning = lastTransaction.installmentRemaning - 1;
          loanAmountRemaning = lastTransaction.loanAmountRemaning - amountPerInstallment;
        }

        const updateLoan = await Loan_Advance_Salary_Model.findByIdAndUpdate(loanId, {
          $push: {
            transactionHistory: {
              paidDate: new Date(),
              loanAmountRemaning,
              installmentRemaning,
              salaryId: salaryDocument._id,
            },
          },
        });
      }

      res.status(200).json({ message: "Salary Generated" });
    } catch (error) {
      console.log("Error Generating Salary", error);
      res.status(501).json({ message: "Error Generating Salary" });
    }
  },

  getSingleSalary: async (req, res) => {
    try {
      const { id } = req.params;

      const salary = await salaryModel.findById(id).populate("employee_obj_id").populate("loanDetails.loanId");

      const {
        employee_obj_id,
        workDetails,
        salaryDetails,
        leaveDetails,
        bonusDetails,
        loanDetails,
        netSalary,
        paidDate,
        salary_month,
        salary_year,
        paymentDetails,
      } = salary.toObject();

      const mappedLeaves = mapLeavesToLabels(leaveDetails);

      const { isLoanActive } = loanDetails;
      const { loanAmount, amountPerInstallment } = loanDetails.loanId;

      const tranformedLoan = {
        isLoanActive,
        ...(isLoanActive ? { loanAmount } : {}),
        ...(isLoanActive ? { amountPerInstallment } : {}),
      };

      const result = {
        employeeDetails: employee_obj_id,
        salaryDetails,
        workDetails,
        leaveDetails: mappedLeaves,
        bonusDetails,
        loanDetails: tranformedLoan,
        netSalary,
        paidDate,
        salary_month,
        salary_year,
        paymentDetails,
      };

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
