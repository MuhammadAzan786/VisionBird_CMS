const express = require("express");
const router = express.Router();
const { create_Team, get_Team, delete_Team } = require("../controllers/teamController");

//post teams
router.post("/create-team", create_Team);
//get teams
router.get("/teams", get_Team);
//delete teams
router.delete("/delete-team/:id", delete_Team);

module.exports = router;
