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
} = require("../controllers/interview.controller");
const authorizeRoles = require("../Middlewares/authorization");
const auth = require("../Middlewares/auth");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ! to show interview data
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

module.exports = router;
