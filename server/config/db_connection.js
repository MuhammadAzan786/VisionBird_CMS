const mongoose = require("mongoose");

function dbconnection() {
  try {
    mongoose.connect(process.env.DB_URL);
    console.log("DataBase Connected !!!!");
  } catch (error) {
    console.log("DataBase Not Connected !!!!");
    console.log(error);
  }
}

module.exports = dbconnection;