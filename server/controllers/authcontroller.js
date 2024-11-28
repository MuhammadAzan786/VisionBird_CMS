const Employee = require("../models/employeemodel");
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../utils/error");

module.exports.signin = async (req, res, next) => {
  const { employeeUsername, employeePassword } = req.body;
console.log("name",employeeUsername,"password",employeePassword);
  try {
const employees=await Employee.find();
console.log("employees hazir",employees)
    const validUser = await Employee.findOne({
      employeeUsername: employeeUsername,
    });
    if (!validUser) {
      return next(errorHandler(404, "User Not Found !!!"));
    }
    if (validUser.employeePassword !== employeePassword) {
      return next(errorHandler(400, "Invalid Password!!!"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const { employeePassword: Password, ...rest } = validUser._doc;

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
