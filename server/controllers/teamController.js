const mongoose = require("mongoose");

const Team = require("../models/teamModel");

module.exports = {

  create_Team: async (req, res) => {
    try {
      const { teamLeader, teamMembers, teamName } = req.body;

      if (!teamLeader || !teamMembers || !teamName) {
        return res.status(400).json({ error: "All fields are required." });
      }

      const allTeams = await Team.find()
        .populate("teamLeader", "employeeName")
        .populate("teamMembers", "employeeName");

      const membersInTeams = new Map();

      allTeams.forEach((team) => {
        team.teamMembers.forEach((member) => {
          membersInTeams.set(member._id.toString(), {
            employeeName: member.employeeName,
            teamName: team.teamName,
          });
        });
      });

      const conflictingMembers = teamMembers.filter((member) =>
        membersInTeams.has(member.toString())
      );

      if (conflictingMembers.length > 0) {
        const conflicts = conflictingMembers.map((member) => ({
          memberId: member,
          employeeName: membersInTeams.get(member.toString()).employeeName,
          teamName: membersInTeams.get(member.toString()).teamName,
        }));

        return res.status(400).json({
          error: "Some team members are already in other teams.",
          conflicts,
        });
      }

      const newTeam = new Team({ teamLeader, teamMembers, teamName });
      await newTeam.save();

      return res
        .status(201)
        .json({ message: "Team created successfully!", team: newTeam });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while creating the team." });
    }
  },
  //view teams
  get_Team: async (req, res) => {
    try {
      const allTeams = await Team.find()
        .populate("teamLeader", "employeeName")
        .populate("teamMembers", "employeeName");

      return res.status(200).json(allTeams);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred." });
    }
  },
  //delete team

  delete_Team: async (req, res) => {
    try {
      const teamId = req.params.id;
  
      if (!mongoose.Types.ObjectId.isValid(teamId)) {
        return res.status(400).json({ error: "Invalid team ID." });
      }
  
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({ error: "Team not found." });
      }
  
      await Team.findByIdAndDelete(teamId);
      return res.status(200).json({ message: "Team deleted successfully." });
    } catch (error) {
      console.error("Delete team error:", error);
      return res.status(500).json({ error: "An error occurred while deleting the team." });
    }
  }
  
  
};
