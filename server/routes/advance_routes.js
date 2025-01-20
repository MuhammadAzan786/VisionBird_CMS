const express = require("express");
const router = express.Router();

const advanceController = require("../controllers/advanceController");

// User Advance Salary Request

// ye ab new route hai=================

router.post("/advance_request/:id", advanceController.loan_advance_request);
// Get User Applications
router.post("/user/applications/:id", advanceController.fetch_user_advance_payments_applications);

router.post("/advance/salary/request", advanceController.advance_salary_request);
// User Loan Request
router.post("/loan/request", advanceController.loan_request);

// ========== Admin Table Routes ============== //

router.post("/admin/applications/:adminId", advanceController.fetch_all_advance_salary_requests);

router.post("/admin/loan/list", advanceController.fetch_all_loan_applications);

router.post("/admin/change_status", advanceController.modify_advance_payments_application_status);

module.exports = router;
