const leavesModel = require("../models/leavesModel");
const notificationModel = require("../models/notificationModel");

let ioInstance;

module.exports = {
  setupIoInstance: (io) => {
    ioInstance = io;
  },

  createLeave: async (req, res) => {
    try {
      const leave = await leavesModel.create(req.body);
      const message = `New leave request from ${req.body.name}`;

      const notification = await notificationModel.create({
        for: req.body.for,
        message,
        leave_id: leave._id,
      });
       ioInstance.to(req.body.for.toString()).emit("notification", notification);
      res.status(201).json("Leave request saved.");
    } catch (error) {
      console.error("Error saving leave: ", error);
      res.status(500).json({ error: "Error saving leave." });
    }
  },

  allLeaves: async (req, res) => {
    try {
      const all_leaves = await leavesModel
        .find()
        .sort({ _id: -1 })
        .populate("from", "employeeName employeeProImage role");
      res.status(200).json(all_leaves);
    } catch (error) {
      console.error("Error getting leaves: ", error);
      res.status(404).json({ error: "Leaves not found." });
    }
  },

  getLeave: async (req, res) => {
    console.log('inside leaves')
    try {
      const _id = req.params.id;
      const leave = await leavesModel.findOne({ _id }).populate("from");
      res.status(200).json(leave);
    } catch (error) {
      console.error("Error fetching leave: ", error);
      res.status(404).json({ error: "Leave not found." });
    }
  },

  myLeaves: async (req, res) => {
    try {
      const id = req.params.id;
      const my_leaves = await leavesModel
        .find({ from: id })
        .sort({ _id: -1 })
        .populate("from", "employeeName employeeProImage");
      res.status(200).json(my_leaves);
    } catch (error) {
      console.error("Error fetching leaves: ", error);
      res.status(404).json({ error: "Leaves not found." });
    }
  },

  employeeLeaves: async (req, res) => {
    try {
      const id = req.params.id;
      const employees_leaves = await leavesModel
        .find({ for: id })
        .sort({ _id: -1 })
        .populate("from", "employeeName employeeProImage");
      res.status(200).json(employees_leaves);
    } catch (error) {
      console.error("Error fetching employees leaves: ", error);
      res.status(404).json({ error: "Employees leaves not found." });
    }
  },

  changeStatus: async (req, res) => {
    try {
      const _id = req.params.id;
      const status = req.body.status;
      const statusForLeave =
        status == "Rejected"
          ? `Rejected by ${req.body.statusChangedBy}`
          : `Accepted by ${req.body.statusChangedBy}`;
      let message = "";
      if (status == "Rejected") {
        message = `Leave request rejected by ${req.body.statusChangedBy}`;
      } else {
        message = `Leave request accepted by ${req.body.statusChangedBy}`;
      }

      await leavesModel.findByIdAndUpdate(_id, { status: statusForLeave });

      const notification = await notificationModel.create({
        for: req.body.for,
        message,
        leave_id: _id,
      }); //For has user ID that has requested leave.
      console.log("notification", notification);
      ioInstance.to(req.body.for.toString()).emit("notification", notification);
      res.status(200).json({ message: "Leave status changed successfully." });
    } catch (error) {
      console.error("Error changing leave status: ", error);
      res.status(500).json({ error: "Error changing leave status." });
    }
  },
};
