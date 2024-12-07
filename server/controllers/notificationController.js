const notificationModel = require("../models/notificationModel");

const notification_model = require("../models/notification_model");

module.exports = {
  createNotification: async (req, res) => {
    try {
      console.log("reqqqqqq", req.body);

      await notification_model.create({
        ...req.body,
      });

      res.status(200).send("req agyi");
    } catch (error) {
      res.status(400).send("rer error");
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
      res.status(400).send("rer error");
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
};
