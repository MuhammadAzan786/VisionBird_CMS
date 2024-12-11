const Employee = require("../models/employeemodel");
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../utils/error");

module.exports.signin = async (req, res, next) => {
  const { employeeUsername, employeePassword } = req.body;
  try {
    const validUser = await Employee.findOne({
      employeeUsername: employeeUsername,
      employeeStatus: "active",
    });
    if (!validUser) {
      return next(errorHandler(404, "User Not Found !!!"));
    }
    if (validUser.employeePassword !== employeePassword) {
      return next(errorHandler(400, "Invalid Password!!!"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "9h",
    });
    const { employeePassword: Password, ...rest } = validUser._doc;

    console.log("signin", rest);

    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "strict",
        // secure: process.env.NODE_ENV === "production",
        secure: false,
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
