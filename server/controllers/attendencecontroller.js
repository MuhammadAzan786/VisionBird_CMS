const Attendence = require("../models/attendencemodel");

module.exports = {
  create_attendence: async (req, res) => {
    const attendenceRecords = req.body; // Expecting an array of attendance records
    try {
      const result = await Attendence.insertMany(attendenceRecords);
      res.status(201).send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  },
  get_attendence_by_date: async (req, res) => {
    const { date } = req.body;
    try {
      const attendence = await Attendence.find({ attendence_date: date });
      res.status(200).send(attendence);
    } catch (error) {
      res.status(400).send(error);
    }
  },
  get_attendence_by_month: async (req, res) => {
    const { month, year } = req.body;
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    try {
      const attendenceRecords = await Attendence.find({
        attendence_date: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      });
      res.status(200).send(attendenceRecords);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
