const advanceSalaryModel = require("../models/advance_salary_model");
const loanModel = require("../models/loanModel");
const advance_notification_model = require("../models/advance_notification_model");
const Loan_Advance_Salary_Model = require("../models/loan_advance_salary_model");
let ioInstance;

module.exports = {
  setupAdvancePaymentIoInstance: (io) => {
    ioInstance = io;
  },

  // =================advance new

  loan_advance_request: async (req, res) => {
    console.log("LOAN ADVANCE REQUEST CONTROLLER", req.body);
    console.log("PARAMS", req.params);
    try {
      const { values } = req.body;
      const { id } = req.params;
      const loanApplication = await Loan_Advance_Salary_Model.create({
        employeeId: id,
        ...values,
      });

      res.status(200).json({ message: "Loan Request Sent", loanApplication });
    } catch (error) {
      console.log("LOAN ERROR", error);
      res.status(501).json({ message: "Erro Creating Loan Request" });
    }
  },

  // =============== Employee Advance Salary Request Controller ================ //
  advance_salary_request: async (req, res) => {
    try {
      const { advanceSalaryMonths, advanceSalaryReason, currentUser } = req.body;

      if (currentUser.probationPeriod === "yes") {
        // checking user probation period
        return res.status(500).json({ msg: "Advance salary not allowed during probation." });
      }
      // ==================== Checking Advance salary or Loan is Active or Pending ========== //

      const activeLoan = await loanModel.findOne({
        employee_obj_id: currentUser._id,
        activity_status: "active",
      });

      const activeAdvanceSalary = await advanceSalaryModel.findOne({
        employee_obj_id: currentUser._id,
        activity_status: "active",
      });

      const pendingLoan = await loanModel.findOne({
        employee_obj_id: currentUser._id,
        approval_status: "pending",
      });

      const pendingAdvanceSalary = await advanceSalaryModel.findOne({
        employee_obj_id: currentUser._id,
        approval_status: "pending",
      });

      if (activeLoan || activeAdvanceSalary) {
        return res.status(500).json({
          msg: "Please clear your previous advance payments first.",
        });
      }

      if (pendingLoan || pendingAdvanceSalary) {
        return res.status(500).json({
          msg: "You already have a request pending for approval.",
        });
      }
      // ==================== Checking Advance salary or Loan is Active or Pending ========== //

      const current_salary = currentUser.BasicPayAfterProbationPeriod;

      const advanceSalaryRequest = new advanceSalaryModel({
        employee_obj_id: currentUser._id,
        employee_name: currentUser.employeeName,
        // current_salary,
        advance_salary_months: advanceSalaryMonths,
        advance_salary_reason: advanceSalaryReason,
      });

      advanceSalaryRequest.save();

      res.status(200).json({ msg: "Advance Salary request is pending for approval." });
    } catch (error) {
      res.status(500).json({
        error: "An error occurred while requesting for advance salary",
      });
      console.log(error);
    }
  },

  // =============== Employee Loan Request Controller ================ //

  loan_request: async (req, res) => {
    try {
      const { loanAmount, loanPayback, loanReason, installmentDuration, currentUser } = req.body;

      if (currentUser.probationPeriod === "yes") {
        // checking user probation period
        return res.status(500).json({ msg: "Loan not allowed during probation." });
      }

      // ==================== Checking Advance salary or Loan is Active or Pending ========== //

      const activeLoan = await loanModel.findOne({
        employee_obj_id: currentUser._id,
        activity_status: "active",
      });

      const activeAdvanceSalary = await advanceSalaryModel.findOne({
        employee_obj_id: currentUser._id,
        activity_status: "active",
      });

      const pendingLoan = await loanModel.findOne({
        employee_obj_id: currentUser._id,
        approval_status: "pending",
      });

      const pendingAdvanceSalary = await advanceSalaryModel.findOne({
        employee_obj_id: currentUser._id,
        approval_status: "pending",
      });

      if (activeLoan || activeAdvanceSalary) {
        return res.status(500).json({
          msg: "Please clear your previous advance payments first.",
        });
      }

      if (pendingLoan || pendingAdvanceSalary) {
        return res.status(500).json({
          msg: "You already have a request pending for approval.",
        });
      }
      // ==================== Checking Advance salary or Loan is Active or Pending ========== //

      const current_salary = currentUser.BasicPayAfterProbationPeriod;

      // Condition for checking if loan Payback is full dont add the installment duration data
      if (loanPayback === "full") {
        if (loanAmount > current_salary) {
          return res.status(400).json({
            msg: "Loan amount should be less then your current sallary",
          });
        }

        const loan_request = new loanModel({
          employee_obj_id: currentUser._id,
          employee_name: currentUser.employeeName,
          loan_amount: loanAmount,
          loan_payback_type: loanPayback,
          loan_reason: loanReason,
          installment_duration_months: 1,
        });

        await loan_request.save();
        res.status(200).json({ msg: "Loan request is pending for approval." });
        return;
      }

      if (loanPayback === "installments") {
        if (loanAmount / installmentDuration > current_salary) {
          return res.status(400).json({
            msg: "You installment plan is not valid",
          });
        }

        const loan_request = new loanModel({
          employee_obj_id: currentUser._id,
          employee_name: currentUser.employeeName,
          loan_amount: loanAmount,
          current_salary,
          loan_payback_type: loanPayback,
          installment_duration_months: installmentDuration,
          loan_reason: loanReason,
        });

        await loan_request.save();
        res.status(200).json({ msg: "Loan request is pending for approval." });
      }
    } catch (error) {
      res.status(500).json({ error: "Error requesting for loan" });
    }
  },

  // =============== Fetch Employee advance payments applications Controller ================ //

  fetch_user_advance_payments_applications: async (req, res) => {
    try {
      const { id } = req.params;

      const employeeApplications = await Loan_Advance_Salary_Model.find({ employeeId: id }).populate(
        "employeeId",
        "employeeProImage employeeID employeeName"
      );

      const mappedEmployeeApplications = employeeApplications.map((item) => {
        const { employeeId, ...advanceData } = item.toObject();
        return { ...employeeId, ...advanceData };
      });

      console.log("EMPLOYEE APPLICATION", mappedEmployeeApplications);

      // const { employeeId, ...advanceData } = employeeApplications.toObject();

      return res.status(200).json(mappedEmployeeApplications);
    } catch (error) {
      res.status(500).json({
        error: "An error occurred while fetching your applications",
      });
      console.log(error);
    }
  },

  // ************************************** Admin Controllers ********************************************** //

  // =============== Fetch All Advance Salary Applications Controller ================ //

  fetch_all_advance_salary_requests: async (req, res) => {
    if (!req.body.currentUser || req.body.currentUser.role !== "admin") {
      return res.status(403).send("You do not have permission to access this resource.");
    }

    try {
      const salaryApplications = await advanceSalaryModel
        .find({})
        .populate("employee_obj_id", "employeeProImage employeeName employeeID BasicPayAfterProbationPeriod")
        .sort({ createdAt: -1 });
      res.status(200).json(salaryApplications);
    } catch (error) {
      res.status(500).json({
        error: "An error occurred while fetching all advance salaries requests",
      });
      console.log(error);
    }
  },

  // =============== Fetch All Advance Salary Applications Controller ================ //

  fetch_all_loan_applications: async (req, res) => {
    if (!req.body.currentUser || req.body.currentUser.role !== "admin") {
      return res.status(403).send("You do not have permission to access this resource.");
    }
    try {
      const loanApplications = await loanModel
        .find({})
        .populate("employee_obj_id", "employeeProImage employeeName employeeID BasicPayAfterProbationPeriod")
        .sort({ createdAt: -1 });
      res.status(200).json(loanApplications);
    } catch (error) {
      res.status(500).json({
        error: "Error fetching all loan applications.",
      });
      console.log(error);
    }
  },

  // =============== Modify Status of Advance Salary Request ================ //

  modify_advance_payments_application_status: async (req, res) => {
    if (req.body.currentUser.role !== "admin") {
      return res.status(403).send("You do not have permission to access this resource.");
    }

    if (req.body.activity_status !== null && req.body.activity_status === "active") {
      res.status(500).json({ msg: "active application status is not allowed to modify" });
    }

    let modified_application;
    try {
      if (req.query.type === "loan") {
        const { _id, approval_status } = req.body;

        if (approval_status === "approved") {
          modified_application = await loanModel
            .findByIdAndUpdate(
              _id,
              {
                approval_status,
                activity_status: "active",
              },
              { new: true }
            )
            .populate("employee_obj_id");
        }

        if (approval_status === "rejected") {
          modified_application = await loanModel
            .findByIdAndUpdate(
              _id,
              {
                approval_status,
              },
              { new: true }
            )
            .populate("employee_obj_id");
        }
      }

      if (req.query.type === "advanceSalary") {
        const { _id, approval_status } = req.body;
        if (approval_status === "approved") {
          modified_application = await advanceSalaryModel
            .findByIdAndUpdate(
              _id,
              {
                approval_status,
                activity_status: "active",
              },
              { new: true }
            )
            .populate("employee_obj_id");
        }

        if (approval_status === "rejected") {
          modified_application = await advanceSalaryModel
            .findByIdAndUpdate(
              _id,
              {
                approval_status,
              },
              { new: true }
            )
            .populate("employee_obj_id");
        }
      }

      res.status(200).json(modified_application);
    } catch (error) {
      return res.status(500).send("there is an error changing status of this application");
    }
  },
};
