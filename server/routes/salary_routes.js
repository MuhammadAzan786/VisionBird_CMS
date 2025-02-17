const express = require("express");
const router = express.Router();
const salaryController = require("../controllers/salarycontroller");

const auth = require('../Middlewares/auth');
const authorizeRoles= require('../Middlewares/authorization') 

router.post("/pay_salary/:id",auth,authorizeRoles('admin','manager'), salaryController.pay_salary);
router.get("/monthly_salary_report",auth,authorizeRoles('admin','manager','employee'), salaryController.monthly_salary_report);
router.get("/explain-query",auth, salaryController.explainQuery);
router.post(
  "/yearly_salary_report",auth,authorizeRoles('admin','manager'),
  salaryController.yearly_salary_report_all_employees
);
router.post(
  "/paid_unpaid_salary_report",auth,authorizeRoles('admin','manager'),
  salaryController.paid_unpaid_salary_report
);
module.exports = router;
