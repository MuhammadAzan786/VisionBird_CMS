const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  for: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  leave_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Leave",
  },
  NotificationName: {
    type: String,
    default: "Leave_Notification",
  },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
