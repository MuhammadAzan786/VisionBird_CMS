const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    type: {
      type: String,
      enum: ["eow", "leave", "task", "salary"],
    },
    message: { type: String, default: "New Message" },
    is_read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("notification_model", notificationSchema);
