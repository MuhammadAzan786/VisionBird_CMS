const express = require("express");
const router = express.Router();
const Employee_controller = require("../controllers/employeecontroller");
const multer = require("multer");

const auth = require("../Middlewares/auth");
const authorizeRoles = require("../Middlewares/authorization");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//creating an employee
router.post(
  "/create_employee",
  auth,
  authorizeRoles("admin", "manager"),
  upload.fields([
    { name: "cnicScanCopy", maxCount: 1 },
    { name: "policeCertificateUpload", maxCount: 1 },
    { name: "degreesScanCopy", maxCount: 1 },
    { name: "employeeProImage", maxCount: 1 },
  ]),
  Employee_controller.create_employee
);

router.patch(
  "/update_employee/:id",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  upload.fields([
    { name: "cnicScanCopy", maxCount: 1 },
    { name: "policeCertificateUpload", maxCount: 1 },
    { name: "degreesScanCopy", maxCount: 1 },
    { name: "employeeProImage", maxCount: 1 },
  ]),
  Employee_controller.update_employee
);

router.get(
  "/all_employees",
  auth,
  authorizeRoles("admin", "manager"),
  Employee_controller.get_employees
);
router.get(
  "/get_employee/:id",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  Employee_controller.get_employee
);
router.get(
  "/get-managers",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  Employee_controller.get_managers
);
router.get(
  "/get-admin",
  auth,
  authorizeRoles("admin", "manager"),
  Employee_controller.get_admin
);
router.get(
  "/get_only_employee",
  auth,
  authorizeRoles("admin", "manager"),
  Employee_controller.get_only_employees
);
router.get(
  "/get_managers_employees",
  auth,
  authorizeRoles("admin", "manager"),
  Employee_controller.get_managers_employees
);
router.delete(
  "/delete_employee/:id",
  auth,
  authorizeRoles("admin", "manager"),
  Employee_controller.delete_employee
);
router.get("/get_employee_ids", Employee_controller.get_employee_ids);
router.get("/searchEmployee", Employee_controller.search_employee);
router.get(
  "/get_active_employees",
  auth,
  authorizeRoles("admin", "manager"),
  Employee_controller.active_employees
);

router.get(
  "/get_inactive_employees",
  auth,
  authorizeRoles("admin", "manager"),
  Employee_controller.inactive_employees
);

router.put(
  "/update_employee_status/:id",
  auth,
  authorizeRoles("admin"),
  Employee_controller.update_employee_status
);

router.get("/check_username", Employee_controller.check_username);

module.exports = router;
