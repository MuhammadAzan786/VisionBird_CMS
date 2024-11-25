const mongoose = require("mongoose");

const employeeOfTheWeekNotificationSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true, // Required field for employee ID
    },
    NotificationName: {
      type: String,
      default: "eowNotification", // Default notification name
    },
    points: {
      type: Number,
      required: true, // Points received by the employee
    },
    name: {
      type: String,
      required: true, // Required field for the notification message
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Export the model
module.exports = mongoose.model("EmployeeOfTheWeekNotification", employeeOfTheWeekNotificationSchema);
