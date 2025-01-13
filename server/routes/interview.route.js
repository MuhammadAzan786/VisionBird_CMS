const express = require("express");
const interview = require("../models/interview.model"); //interview models
const router = express.Router();
const multer = require("multer");
const {
  viewData,
  viewDataById,
  addData,
  deleteData,
  updateResponse,
  updateRemarks,
  searchInterviews,
  pending_Evaluations,
  not_appeared_Evaluations,
  appeared_Evaluations,
  update_record_when_appeared,
  update_interviewCalled_status,
} = require("../controllers/interview.controller");
const authorizeRoles = require("../Middlewares/authorization");
const auth = require("../Middlewares/auth");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get(
  "/pending_evaluations",
  auth,
  authorizeRoles("admin", "manager"),
  pending_Evaluations
);

router.get(
  "/appeared_evaluations",
  auth,
  authorizeRoles("admin", "manager"),
  appeared_Evaluations
);

router.get(
  "/not_appeared_evaluations",
  auth,
  authorizeRoles("admin", "manager"),
  not_appeared_Evaluations
);

// // ! to show interview data
router.get("/", auth, authorizeRoles("admin", "manager"), viewData);

// ! to show interview data by a specific id
router.get("/:id", auth, authorizeRoles("admin", "manager"), viewDataById);

// ! post function
router.post(
  "/add_evaluation",
  auth,
  authorizeRoles("admin", "manager"),
  upload.single("file"),
  addData
);

// ! delete data
router.delete(
  "/delete_evaluation/:id",
  auth,
  authorizeRoles("admin", "manager"),
  deleteData
);

// ! update response
router.post(
  "/update_response/:id",
  auth,
  authorizeRoles("admin", "manager"),
  updateResponse
);

// ! update response
router.post(
  "/update_interview_record/:id",
  auth,
  authorizeRoles("admin", "manager"),
  updateRemarks
);

router.post(
  "/search",
  auth,
  authorizeRoles("admin", "manager"),
  searchInterviews
);

router.put("/update_record_when_appeared/:id", update_record_when_appeared);

router.put("/update_interviewCalled_status/:id", update_interviewCalled_status);

module.exports = router;
