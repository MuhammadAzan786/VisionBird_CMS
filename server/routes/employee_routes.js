const express = require("express");
const router = express.Router();
const Employee_controller = require("../controllers/employeecontroller");
const multer = require("multer");

const auth = require("../Middlewares/auth");
const authorizeRoles = require("../Middlewares/authorization");
// const auth = require("../Middlewares/auth");
// const authorizeRoles = require("../Middlewares/authorization");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/create_employee", auth, authorizeRoles("admin", "manager"), Employee_controller.create_employee);

router.patch(
  "/update_employee/:id",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  Employee_controller.update_employee
);

router.get("/all_employees", auth, authorizeRoles("admin", "manager"), Employee_controller.get_employees);
router.get("/get_employee/:id", auth, authorizeRoles("admin", "manager", "employee"), Employee_controller.get_employee);
router.get("/get-managers", auth, authorizeRoles("admin", "manager", "employee"), Employee_controller.get_managers);
router.get("/get-admin", auth, authorizeRoles("admin", "manager"), Employee_controller.get_admin);
router.get("/get_only_employee", auth, authorizeRoles("admin", "manager"), Employee_controller.get_only_employees);
router.get(
  "/get_managers_employees",
  auth,
  authorizeRoles("admin", "manager"),
  Employee_controller.get_managers_employees
);
router.delete("/delete_employee/:id", auth, authorizeRoles("admin", "manager"), Employee_controller.delete_employee);

// Garbage collector incase window or tab is closed
router.post("/grabage_collector", Employee_controller.grabge_collector);

// Delete Documents
router.delete(
  "/delete_documents/",
  auth,
  authorizeRoles("admin", "manager"),
  Employee_controller.delete_employee_documents
);
router.get("/get_employee_ids", Employee_controller.get_employee_ids);
router.get("/searchEmployee", Employee_controller.search_employee);
router.get("/get_active_employees", auth, authorizeRoles("admin", "manager"), Employee_controller.active_employees);

router.get("/get_inactive_employees", auth, authorizeRoles("admin", "manager"), Employee_controller.inactive_employees);

router.put("/update_employee_status/:id", auth, authorizeRoles("admin"), Employee_controller.update_employee_status);

router.get("/get_active_employees", auth, authorizeRoles("admin", "manager"), Employee_controller.active_employees);

router.get("/get_inactive_employees", auth, authorizeRoles("admin", "manager"), Employee_controller.inactive_employees);

router.put("/update_employee_status/:id", auth, authorizeRoles("admin"), Employee_controller.update_employee_status);

module.exports = router;
