const express = require("express");
const {
  postEvaluations,
  getEvaluationsByWeek,
  getEvaluationsByEmployee,
  updateEvaluation,
  getEvaluationsByEmployeeForWeek,
  checkReportExists,
  getReportDates,
  getAllEvaluations
} = require("../controllers/emp_of_week.controller");

const auth = require('../Middlewares/auth');
const router = express.Router();
const authorizeRoles= require('../Middlewares/authorization') 

// POST: Create new employee of the week evaluation
router.post("/evaluation",auth, authorizeRoles('admin','manager'), postEvaluations);

// GET: Check if the record for the date exists or not
router.get("/checkReportExists/:evaluation_date", checkReportExists);

// GET: Retrieve all evaluations for a specific week
router.get("/evaluations/week/:week_no",auth, authorizeRoles('admin','manager'), getEvaluationsByWeek);

// GET: Retrieve all evaluations for a specific employee
router.get("/evaluations/employee/emp_week",auth, authorizeRoles('admin','manager','employee'), getEvaluationsByEmployeeForWeek);

// GET: Retrieve all evaluations for a specific employee
router.get("/evaluations/employee/:employee_id",auth, authorizeRoles('admin','manager'),  getEvaluationsByEmployee);

// PUT: Update an existing evaluation for a specific week and employee
router.put("/evaluation/:week_no/:employee_id",auth, authorizeRoles('admin','manager'),  updateEvaluation);

// GET: Get dates for which the evaluations have been added
router.get("/getReportDates", getReportDates);

//GET: geet all evaluations history
router.get("/allevaluations", getAllEvaluations)

module.exports = router;
