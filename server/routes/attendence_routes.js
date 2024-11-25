const express = require("express");
const router = express.Router();
const attendence_controller = require("../controllers/attendencecontroller");
const authorizeRoles= require('../Middlewares/authorization') 


router.post("/create_attendence", authorizeRoles('admin','manager'), attendence_controller.create_attendence);
router.get("/get_atten_by_date",  authorizeRoles('admin','manager'),attendence_controller.get_attendence_by_date);
router.get(
  "/get_atten_by_month", authorizeRoles('admin','manager'),
  attendence_controller.get_attendence_by_month
);

module.exports = router;
