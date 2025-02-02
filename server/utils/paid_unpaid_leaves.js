//TODO:LATER NEED TO ADD ANOTHER CHECK FOR APPLICATION APPROVED IN REDUCE METHOD

const { default: mongoose } = require("mongoose");
const leavesModel = require("../models/leavesModel");

//We have two leave types (full & half)
//First Separate full and half Leave type using reduce.
//Then loop over full leaves to incremenet paidLeavesCount or unpaidLeavesCount
//Then loop over half leaves to incremenet halfLeavesPaidCount or halfLeavesUnpaidCount

const paid_unpaid_leaves = async (userId, month, year) => {
  let paidLeavesCountBefore = 0;
  let unpaidLeavesCountBefore = 0;
  let paidLeavesCount = 0;
  let unpaidLeavesCount = 0;
  let halfLeavesPaidCount = 0;
  let halfLeavesUnpaidCount = 0;

  // Types

  const fullLeaveType = "Full Leave";
  const halfLeaveType = "Half Leave";
  const longLeavesType = "Long Leaves";

  //Category
  const unpaidLeaveCategory = "Unpaid Leave";
  const paidLeaveCategory = "Paid Leave";

  const totalLeaves = await leavesModel.aggregate([
    {
      $match: {
        from: new mongoose.Types.ObjectId(userId),
        $expr: {
          $or: [
            {
              $and: [{ $eq: [{ $year: "$selectedDate" }, year] }, { $eq: [{ $month: "$selectedDate" }, month] }],
            },
            {
              $and: [{ $eq: [{ $year: "$leavesStart" }, year] }, { $eq: [{ $month: "$leavesStart" }, month] }],
            },
          ],
        },
      },
    },
  ]);

  const [fullLeaves, halfLeaves, longLeaves] = totalLeaves.reduce(
    (acc, value) => {
      if (value.leaveType === fullLeaveType) {
        acc[0].push(value);
      }
      if (value.leaveType === halfLeaveType) {
        acc[1].push(value);
      }
      if (value.leaveType === longLeavesType) {
        acc[2].push(value);
      }

      return acc;
    },
    [[], [], []]
  );

  // console.log("Reduce Type Full leaves", fullLeaves);
  // console.log(" Reduce Type half leaves", halfLeaves);

  //looping over full leaves to increment paidLeaves or UnpaidLeaves

  for (const leave of fullLeaves) {
    if (leave.leaveCategory === paidLeaveCategory) {
      paidLeavesCount += 1;
      paidLeavesCountBefore += 1;
    }
    if (leave.leaveCategory === unpaidLeaveCategory) {
      unpaidLeavesCount += 1;
      unpaidLeavesCountBefore += 1;
    }
  }

  //looping over full leaves to increment halfLeavesPaidCount or halfLeavesUnpaidCount
  for (const leave of halfLeaves) {
    if (leave.leaveCategory === paidLeaveCategory) {
      halfLeavesPaidCount += 1;
    }
    if (leave.leaveCategory === unpaidLeaveCategory) {
      halfLeavesUnpaidCount += 1;
    }
  }

  // console.log("half leaves paid:", halfLeavesPaidCount);
  // console.log("half leaves Unpaid:", halfLeavesUnpaidCount);

  // ******************** Long Leaves Calculation

  const [longLeaveUnapaid, longLeavePaid] = longLeaves.reduce(
    (acc, leave) => {
      if (leave.leaveCategory === unpaidLeaveCategory) {
        acc[0].push(leave);
      } else {
        acc[1].push(leave);
      }
      return acc;
    },
    [[], []]
  );

  // console.log("Unpaid long", longLeaveUnapaid);
  // console.log("paid long", longLeavePaid);

  const longLeaveUnapaidCount = longLeaveUnapaid.reduce((acc, value) => {
    acc += LongLeaveCalculation(value);
    return acc;
  }, 0);
  // console.log("Long Leaves result", longLeaveUnapaidCount);

  const longLeavePaidCount = longLeavePaid.reduce((acc, value) => {
    acc += LongLeaveCalculation(value);
    return acc;
  }, 0);

  // ******************** Long Leaves Calculation

  paidLeavesCount += Math.floor(halfLeavesPaidCount / 3) + longLeavePaidCount;
  unpaidLeavesCount += Math.floor(halfLeavesUnpaidCount / 3) + longLeaveUnapaidCount;

  const leaveValues = {
    halfLeavesCount: halfLeaves.length,
    casualLeaves: 55,
    sickLeaves: 55,
    unpaidLeavesCount,
    paidLeavesCount,
    otherLeaves: longLeaveUnapaidCount,
  };

  //for frontend data transforming
  const leaveDetails = mapLeavesToLabels(leaveValues);

  return {
    unpaidLeavesCount,
    leaveDetails,
  };
};

const LongLeaveCalculation = (longLeave) => {
  const leaveStart = {
    date: longLeave.leavesStart.getDate(),
    month: longLeave.leavesStart.getMonth(),
    year: longLeave.leavesStart.getFullYear(),
  };

  const leavesEnd = {
    date: longLeave.leavesEnd.getDate(),
    month: longLeave.leavesEnd.getMonth(),
    year: longLeave.leavesEnd.getFullYear(),
  };

  // console.log("leaveStart", leaveStart);
  // console.log("leavesEnd", leavesEnd);

  //   First Case if month is same
  if (leaveStart.month === leavesEnd.month) {
    const filteredLeaves = filteredWeekendsLeaves(leaveStart, leavesEnd);

    // console.warn("1st condition, Month is same");
    // console.log("filtered leaves", filteredLeaves);

    return filteredLeaves.length;
  }

  const currentMonth = new Date().getMonth(); //TODO: ye hardcode kya hai for testing===================================

  //   2nd Case if  long leave is between two months. and current month is eq to starting month
  if (currentMonth === leaveStart.month) {
    const { leaveCurrentStartDate, leaveCurrentEndDate } = extractMonthDatestEndToStart(leaveStart);

    const filteredLeaves = filteredWeekendsLeaves(leaveCurrentStartDate, leaveCurrentEndDate);

    // console.warn("2nd condition, Diff Month but current is eq to start");
    // console.log("leaveCurrentStartDate", leaveCurrentStartDate);
    // console.log("leaveCurrentEndDate", leaveCurrentEndDate);
    // console.log("filtered leaves", filteredLeaves);
    return filteredLeaves.length;
  }

  //   3rd Case if  long leave is between two months. and current month is eq to end month
  if (currentMonth === leavesEnd.month) {
    // Agr month phly end valy object me hai

    const { leaveCurrentStartDate, leaveCurrentEndDate } = extractMonthDatesStartToEnd(leavesEnd);
    const filteredLeaves = filteredWeekendsLeaves(leaveCurrentStartDate, leaveCurrentEndDate);

    // console.warn("3rd condition, Diff Month but current is eq to end");
    // console.log("leaveCurrentStartDate", leaveCurrentStartDate);
    // console.log("leaveCurrentEndDate", leaveCurrentEndDate);
    // console.log("filtered leaves", filteredLeaves);

    return filteredLeaves.length;
  }
};

const filteredWeekendsLeaves = (leaveStart, leavesEnd) => {
  const weekendDates = getWeekDates(leaveStart.month, leaveStart.year);
  // console.log("Weekend Dates", weekendDates);
  // console.log("Weekends Length", weekendDates.length);

  const monthLeaveDates = Array.from(
    { length: leavesEnd.date - leaveStart.date + 1 },
    (_, index) => leaveStart.date + index
  );

  // console.log("Month Leave Dates", monthLeaveDates);

  const filteredWeekendsLeaves = monthLeaveDates.filter((item) => {
    return !weekendDates.includes(item);
  });

  return filteredWeekendsLeaves;
};

const getWeekDates = (month, year) => {
  const total = new Date(year, month + 1, 0).getDate();

  let weekendDates = [];

  for (let i = 1; i <= total; i++) {
    day = new Date(year, month, i).getDay();

    if (day === 0 || day === 6) {
      weekendDates.push(i);
    }
  }

  return weekendDates;
};

const extractMonthDatestEndToStart = (leaveStart) => {
  const lastDate = new Date(leaveStart.year, leaveStart.month + 1, 0);

  const leaveCurrentStartDate = {
    ...leaveStart,
  };

  const leaveCurrentEndDate = {
    date: lastDate.getDate(),
    month: lastDate.getMonth(),
    year: lastDate.getFullYear(),
  };

  return { leaveCurrentStartDate, leaveCurrentEndDate };
};

const extractMonthDatesStartToEnd = (leaveStart) => {
  const startDate = new Date(leaveStart.year, leaveStart.month, 1);

  const leaveCurrentStartDate = {
    date: startDate.getDate(),
    month: startDate.getMonth(),
    year: startDate.getFullYear(),
  };

  const leaveCurrentEndDate = {
    ...leaveStart,
  };

  return { leaveCurrentStartDate, leaveCurrentEndDate };
};

const mapLeavesToLabels = (leaveDetails) => {
  const labels = [
    "Short /Half Leave:",
    "Casual Leave:",
    "Sick Leave:",
    "Without Pay Leave:",
    "Cash Leave:",
    "Other Leaves",
  ];

  const keys = Object.keys(leaveDetails);

  console.log("check test22222222", leaveDetails);

  console.log("check test", leaveDetails.hasOwnProperty("netSalaryWithLeaveCutting"));

  if (leaveDetails.hasOwnProperty("netSalaryWithLeaveCutting")) {
    console.log("isme aya hai");
    labels.push("Net Salary");
  }

  if (labels.length === keys.length) {
    const mapped = labels.map((item, index) => {
      const key = keys[index];
      return {
        key,
        label: item,
        value: leaveDetails[key],
      };
    });

    return mapped;
  }
  console.error("Function: mapLeavesToLabels, Labels and leave details keys length mismatch.");
  return [];
};

module.exports = { mapLeavesToLabels, paid_unpaid_leaves };

// module.exports = paid_unpaid_leaves;
