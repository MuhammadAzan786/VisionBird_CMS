const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authorizeRoles = require("../Middlewares/authorization");

const auth = require("../Middlewares/auth");

router.post("/create", notificationController.createNotification);
router.get("/user/:id", notificationController.getUserNotifications);
router.get("/tasknotifications/:id", notificationController.getTaskNotifications);

// Manager route to get task completion notifications
router.get("/manager/taskcompleted/:id", notificationController.getManagerTaskCompletedNotifications);

// Employee route to get assigned task notifications
router.get("/employee/taskassigned/:id", notificationController.getEmployeeAssignedTaskNotifications);
router.delete(
  "/delete/:id",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  notificationController.deleteNotification
);

module.exports = router;
