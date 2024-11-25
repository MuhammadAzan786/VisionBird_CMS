const fs = require("fs");
const path = require("path");

module.exports = {
  countSundaysAndSaturdays: (year, month) => {
    // Initialize counters for Sundays and Saturdays
    let sundays = 0;
    let saturdays = 0;

    // Create a Date object for the first day of the month
    let date = new Date(year, month - 1, 1);

    // Loop through each day of the month
    while (date.getMonth() === month - 1) {
      // Check if the day is Sunday (0) or Saturday (6)
      if (date.getDay() === 0) {
        sundays++;
      } else if (date.getDay() === 6) {
        saturdays++;
      }

      // Move to the next day
      date.setDate(date.getDate() + 1);
    }

    // Return the counts
    return { sundays, saturdays };
  },
  getCurrentYear: () => {
    const date = new Date();
    return date.getFullYear();
  },
};
