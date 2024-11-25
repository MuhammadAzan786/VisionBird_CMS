const express = require("express");
const { signin } = require("../controllers/authcontroller");

const auth = require('../Middlewares/auth');
const router = express.Router();

router.post("/sign-in", signin);

module.exports = router;