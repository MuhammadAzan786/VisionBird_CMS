const mongoose = require("mongoose");

const dbconnection = () => {
  const DB_URL =
    process.env.NODE_ENV === "production"
      ? process.env.DB_URL
      : process.env.LOCAL_DB_URL;

  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log(
        `✅ Database connected successfully! in ${process.env.NODE_ENV} Enviroment `
      );
    })
    .catch((error) => {
      console.error("❌ Database connection failed:", error.message);
      process.exit(1); // Exit the process with a failure code
    });
};

module.exports = dbconnection;
