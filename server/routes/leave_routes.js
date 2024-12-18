const express = require("express");
const router = express.Router();
const leavesController = require("../controllers/leavesController");
const authorizeRoles = require("../Middlewares/authorization");

const auth = require("../Middlewares/auth");
router.post(
  "/create-leave",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  leavesController.createLeave
);
router.get(
  "/all-leaves",
  auth,
  authorizeRoles("admin", "manager"),
  leavesController.allLeaves
);
router.get(
  "/get-leave/:id",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  leavesController.getLeave
);
router.get(
  "/my-leaves/:id",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  leavesController.myLeaves
);
router.get(
  "/my-all-leaves/:id",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  leavesController.my_all_leaves
);
router.get(
  "/employee-leaves/:id",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  leavesController.employeeLeaves
);
router.put(
  "/change-status/:id",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  leavesController.changeStatus
);

module.exports = router;
