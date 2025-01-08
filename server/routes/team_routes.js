const express = require("express");
const router = express.Router();
const { create_Team } = require("../controllers/teamController");

router.post("/create-team", create_Team);

module.exports = router;
