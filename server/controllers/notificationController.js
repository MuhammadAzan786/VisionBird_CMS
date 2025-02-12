const notificationModel = require("../models/notificationModel");
const taskNotificationModel = require("../models/taskNotificationModel");
const notification_model = require("../models/notification_model");

module.exports = {
  createNotification: async (req, res) => {
    try {
      console.log("request", req.body);

      await notification_model.create({
        ...req.body,
      });

      res.status(200).send("Request recieved successfully");
    } catch (error) {
      res.status(400).send("Request error");
    }
  },

  getUserNotifications: async (req, res) => {
    try {
      const { id } = req.params;
      console.log("Notification Request Recived", id);
      const response = await notification_model
        .find({
          to: id,
        })
        .populate("from", "employeeProImage");

      console.log("res mongoose", response);

      res.status(200).json(response);
    } catch (error) {
      res.status(400).send("Request error");
    }
  },

  deleteNotification: async (req, res) => {
    try {
      const _id = req.params.id;
      await notificationModel.findByIdAndDelete({ _id });
      res.status(200).json({ message: "Notification deleted successfully." });
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ error: "Error in deleting notification" });
    }
  },

  getTaskNotifications: async (req, res) => {
    try {
      const { id } = req.params; // Task ID is passed in the URL

      console.log("Task Notification Request Received for Task ID:", id);

      // Fetch task notifications using the provided Task ID
      const notifications = await taskNotificationModel
        .find({ Task_id: id }) // Match documents where Task_id equals the provided ID
        .populate("Task_id", "taskTitle") // Optionally populate task title (if needed)
        .sort({ createdAt: -1 }); // Sort by the latest notification

      // If no notifications are found
      if (notifications.length === 0) {
        console.log("No notifications found for Task ID:", id);
        return res.status(404).json({ message: "No task notifications found." });
      }

      console.log("Task Notifications Fetched:", notifications);
      res.status(200).json(notifications);
    } catch (error) {
      console.error("Error fetching task notifications:", error);
      res.status(400).send("Error fetching task notifications");
    }
  },

    // Function to get task completed notifications for managers/admin
    getManagerTaskCompletedNotifications: async (req, res) => {
      try {
        const { manager_id } = req.params; // Manager's ID is passed in the URL
    
        console.log("Manager Task Completed Notification Request Received for Manager ID:", manager_id);
    
        // Get the start and end of the current day
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
    
        // Fetch notifications where manager is involved and task is completed for the current day
        const notifications = await taskNotificationModel
          .find({
            id: manager_id, // Filter by manager ID
            message: /has completed the Task/i, // Filter by messages containing "completed" (case insensitive)
            createdAt: { $gte: startOfDay, $lte: endOfDay }, // Filter by today's date
          })
          .populate("Task_id", "taskTitle") // Optionally populate task title (if needed)
          .sort({ createdAt: -1 }); // Sort by the latest notification
    
        if (notifications.length === 0) {
          console.log("No task completed notifications found for Manager ID:", manager_id);
          return res.status(404).json({ message: "No task completed notifications found for today." });
        }
    
        console.log("Manager Task Completed Notifications Fetched:", notifications);
        res.status(200).json(notifications);
      } catch (error) {
        console.error("Error fetching task completed notifications for manager:", error);
        res.status(400).send("Error fetching task completed notifications");
      }
    },
    
    // Function to get task assigned notifications for employees
    getEmployeeAssignedTaskNotifications: async (req, res) => {
      try {
        const { employee_id } = req.params; // Employee's ID is passed in the URL
    
        console.log("Employee Task Assigned Notification Request Received for Employee ID:", employee_id);
    
        // Get the start and end of the current day
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
    
        // Fetch notifications where employee is assigned a new task for the current day
        const notifications = await taskNotificationModel
          .find({
            id: employee_id, // Filter by employee ID
            message: /New Task From/i, // Filter by messages containing "New Task From" (case insensitive)
            createdAt: { $gte: startOfDay, $lte: endOfDay }, // Filter by today's date
          })
          .populate("Task_id", "taskTitle") // Optionally populate task title (if needed)
          .sort({ createdAt: -1 }); // Sort by the latest notification
    
        if (notifications.length === 0) {
          console.log("No task assigned notifications found for Employee ID:", employee_id);
          return res.status(404).json({ message: "No task assigned notifications found for today." });
        }
    
        console.log("Employee Task Assigned Notifications Fetched:", notifications);
        res.status(200).json(notifications);
      } catch (error) {
        console.error("Error fetching task assigned notifications for employee:", error);
        res.status(400).send("Error fetching task assigned notifications");
      }
    },
    
};
