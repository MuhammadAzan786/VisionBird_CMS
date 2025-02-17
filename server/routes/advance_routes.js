const express = require("express");
const router = express.Router();

const advanceController = require("../controllers/advanceController");

// User Advance Salary Request

router.post(
  "/advance/salary/request",
  advanceController.advance_salary_request
);
// User Loan Request
router.post("/loan/request", advanceController.loan_request);

// Get User Applications
router.post(
  "/user/advance-applications",
  advanceController.fetch_user_advance_payments_applications
);

// ========== Admin Table Routes ============== //

router.post(
  "/admin/advance/salary/list",
  advanceController.fetch_all_advance_salary_requests
);

router.post("/admin/loan/list", advanceController.fetch_all_loan_applications);

router.post(
  "/admin/advance-applications",
  advanceController.modify_advance_payments_application_status
);

module.exports = router;
