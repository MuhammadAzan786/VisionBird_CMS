const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
  {
    teamLeader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    teamMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
      },
    ],
    teamName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Team = mongoose.model("Team", TeamSchema);

module.exports = Team;
