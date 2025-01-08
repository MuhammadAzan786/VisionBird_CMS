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
};
