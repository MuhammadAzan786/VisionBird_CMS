const salaryModel = require("../models/salarymodel");
const employeeModel = require("../models/employeemodel");
const paid_unpaid_leaves = require("../utils/paid_unpaid_leaves");

const daysInMonth = require("../utils/date/daysInMonths");
const calculateGrossSalary = require("../utils/calculateGrossSalary");

module.exports = {
  //Months are comming 1-12 based
  view_salary: async (req, res) => {
    try {
      const { salary_month, salary_year, incentive, extra_bonus, employeeDetails } = req.body;

      const { _id: employee_id } = employeeDetails;

      const employee = await employeeModel.findOne({ _id: employee_id });

      const leaves_data = await paid_unpaid_leaves(employee_id, Number(salary_month), Number(salary_year));
      const { unpaidLeavesCount } = leaves_data;

      const { gross_salary, basic_pay, allowances } = await calculateGrossSalary(employee);

      const number_of_days_in_month = daysInMonth(salary_year, salary_month);
      const per_day_wage = gross_salary / number_of_days_in_month;
      const unpaid_leave_amount = unpaidLeavesCount * per_day_wage;

      let net_salary = gross_salary + Number(extra_bonus) + Number(incentive) - unpaid_leave_amount;

      const total_days_worked = 80; //TODO: Later remove hardcore

      //Leavs ki info jaani hai
      //Days worked
      //basipay, allowances, grossSalary
      //net_salary

      res.json({
        leaveDetails: leaves_data,
        salaryDetails: {
          basic_pay,
          allowances,
          gross_salary,
          net_salary,
        },
        workDetails: {
          total_days_worked,
        },
      });
    } catch (error) {
      console.log("Error View Salary", error);
      res.send(error);
    }
  },

  pay_salary: async (req, res) => {
    try {
      console.log("Req agyi pay salary");

      const { userId, salaryDetails, workDetails, leaveDetails } = req.body;

      console.log(req.body);

      const salaryData = {
        employee_obj_id: userId,
      };

      // const salaryData = {
      //   employee_obj_id: employee_id,
      //   salary_month,
      //   salary_year,
      //   Half_leaves: 4,
      //   Full_leaves: 4,
      //   paid_leaves: 4,
      //   unpaid_leaves: 4,
      //   incentive: Number(incentive),
      //   gross_salary,
      //   net_salary,
      //   extra_bonus: Number(extra_bonus),
      //   cheque_number,
      // };

      // await salaryModel.create(salaryData);

      res.status(200).json({ message: "Salary Generated" });
    } catch (error) {
      console.log("Error Generating Salary", error);
      res.status(501).json({ message: "Error Generating Salary" });
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

  calculate_leaves: async (req, res) => {},
};
