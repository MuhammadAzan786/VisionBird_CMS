const mongoose = require("mongoose");

const advancePaymentNotificationsSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    NotificationName: {
      type: String,
      default: "Advance_Payment_Notification",
    },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Advance_Payment_Notification",
  advancePaymentNotificationsSchema
);
