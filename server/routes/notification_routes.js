const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authorizeRoles = require("../Middlewares/authorization");

const auth = require("../Middlewares/auth");

router.post("/create", notificationController.createNotification);
router.get("/user/:id", notificationController.getUserNotifications);
router.delete(
  "/delete/:id",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  notificationController.deleteNotification
);

module.exports = router;
